import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project.mjs';

export const runtime = 'nodejs';

const MAX_BYTES = 4 * 1024 * 1024;
const EXT_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const BUCKET = process.env.SUPABASE_BUCKET;
const FOLDER = 'projects';

function isValidMagicBytes(buffer, declaredType) {
    if (!buffer || buffer.length < 12) return false;

    // JPEG: FF D8 FF
    if (declaredType === 'image/jpeg') {
        return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    }

    // PNG: 89 50 4E 47
    if (declaredType === 'image/png') {
        return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    }

    // WebP: RIFF (52 49 46 46) .... WEBP (57 45 42 50)
    if (declaredType === 'image/webp') {
        const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
        const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
        return isRiff && isWebp;
    }

    return false;
}

const slugify = (s) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);

export async function POST(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
    }

    // Strict Admin Authorization (RBAC)
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!adminEmail) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }
    const isAdmin = user.email?.toLowerCase() === adminEmail || user.user_metadata?.role === 'admin';
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    // Require MFA-verified session (aal2)
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== 'aal2') {
        return NextResponse.json({ error: 'Two-factor MFA authentication is required.' }, { status: 403 });
    }

    let formData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    }

    const title = formData.get('title')?.toString().trim();
    const type = formData.get('type')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const longDescription = formData.get('longDescription')?.toString().trim() || '';
    const image = formData.get('image');
    const galleryFiles = formData.getAll('gallery');

    if (!title || !type || !location || !description || !(image instanceof File)) {
        return NextResponse.json(
            { error: 'Title, type, location, description, and an image are required.' },
            { status: 400 }
        );
    }

    const allImages = [image, ...galleryFiles];
    const imageBuffers = [];

    for (const file of allImages) {
        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'Invalid project image file.' }, { status: 400 });
        }
        if (!EXT_BY_TYPE[file.type]) {
            return NextResponse.json({ error: 'Only JPG, PNG or WebP images are allowed.' }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'Each image must be 4 MB or smaller.' }, { status: 413 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        if (!isValidMagicBytes(buffer, file.type)) {
            return NextResponse.json(
                { error: `File "${file.name}" has invalid image signatures (possible spoofed file type).` },
                { status: 400 }
            );
        }
        imageBuffers.push({ file, buffer });
    }

    const uploadedPaths = [];
    let imagePath;
    const gallery = [];
    const cleanupUploads = async () => {
        if (uploadedPaths.length === 0) return;
        try {
            await supabaseAdmin.storage.from(BUCKET).remove(uploadedPaths);
        } catch (error) {
            console.error('Storage cleanup failed:', error.message);
        }
    };

    try {
        for (const [index, { file, buffer }] of imageBuffers.entries()) {
            const storagePath = `${FOLDER}/${randomUUID()}.${EXT_BY_TYPE[file.type]}`;
            const { error: uploadError } = await supabaseAdmin.storage
                .from(BUCKET)
                .upload(storagePath, buffer, {
                    contentType: file.type,
                    cacheControl: '31536000',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Storage upload failed:', uploadError.message);
                await cleanupUploads();
                return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
            }

            uploadedPaths.push(storagePath);
            if (index === 0) {
                imagePath = storagePath;
            } else {
                gallery.push({ src: storagePath, alt: `${title} project photo ${index}` });
            }
        }
    } catch (error) {
        console.error('Storage upload failed:', error.message);
        await cleanupUploads();
        return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
    }

    // Save the record in MongoDB
    let project;
    try {
        await dbConnect();
        project = await Project.create({
            title,
            slug: `${slugify(title)}-${randomUUID().slice(0, 6)}`,
            category: type,
            location,
            description,
            longDescription,
            image: imagePath,
            gallery,
            order: 0,
            published: true,
        });
    } catch (err) {
        console.error('Saving project failed:', err.message);
        await cleanupUploads();
        return NextResponse.json({ error: 'Project data could not be saved.' }, { status: 500 });
    }

    return getResponse(
        NextResponse.json(
            {
                ok: true,
                message: 'Project uploaded successfully.',
                project: {
                    id: project._id,
                    slug: project.slug,
                    title: project.title,
                },
            },
            { status: 201 }
        )
    );
}