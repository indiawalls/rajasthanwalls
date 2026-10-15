import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project.mjs';

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
const EXT_BY_TYPE = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};

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

async function processProjectImage(file) {
    if (!file || !(file instanceof File) || file.size === 0) {
        return null;
    }
    if (!EXT_BY_TYPE[file.type]) {
        throw new Error('Only JPG, PNG or WebP images are allowed.');
    }
    if (file.size > MAX_BYTES) {
        throw new Error('Project image file must be 5MB or smaller.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isValidMagicBytes(buffer, file.type)) {
        throw new Error('Invalid or corrupted image file format.');
    }

    const ext = EXT_BY_TYPE[file.type] || 'webp';
    const storagePath = `projects/${randomUUID()}.${ext}`;
    const bucket = process.env.SUPABASE_BUCKET;

    if (bucket) {
        try {
            const { error: uploadError } = await supabaseAdmin.storage
                .from(bucket)
                .upload(storagePath, buffer, {
                    contentType: file.type,
                    cacheControl: '31536000',
                    upsert: false,
                });

            if (!uploadError) {
                return { path: storagePath, storage: 'supabase' };
            }
            console.warn('[STORAGE] Supabase project upload failed or storage is full, falling back to database:', uploadError.message);
        } catch (err) {
            console.warn('[STORAGE] Supabase exception, falling back to database:', err.message);
        }
    }

    // Fallback: save inline as Base64 Data URI in database
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
    return { path: dataUri, storage: 'database' };
}

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
        return auth.getResponse(NextResponse.json({ success: true, projects }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const contentType = request.headers.get('content-type') || '';
        let title, category, location, description, longDescription, image, order, published, slug;
        let file = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            title = formData.get('title')?.toString();
            category = formData.get('category')?.toString();
            location = formData.get('location')?.toString();
            description = formData.get('description')?.toString();
            longDescription = formData.get('longDescription')?.toString();
            image = formData.get('image')?.toString();
            slug = formData.get('slug')?.toString();
            if (formData.has('order')) {
                order = Number(formData.get('order'));
            }
            if (formData.has('published')) {
                published = formData.get('published') === 'true' || formData.get('published') === true;
            }
            const uploadedFile = formData.get('imageFile');
            if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
                file = uploadedFile;
            }
        } else {
            const json = await request.json();
            title = json.title;
            category = json.category;
            location = json.location;
            description = json.description;
            longDescription = json.longDescription;
            image = json.image;
            slug = json.slug;
            order = json.order;
            published = json.published;
        }

        if (file) {
            const uploaded = await processProjectImage(file);
            if (uploaded?.path) {
                image = uploaded.path;
            }
        }

        if (!title || !category || !location || !image) {
            return NextResponse.json(
                { error: 'Title, category, location, and an image (or file upload) are required' },
                { status: 400 }
            );
        }

        await dbConnect();
        const cleanTitle = title.trim();
        const projectSlug = slug && slug.trim()
            ? slug.trim().toLowerCase()
            : `${slugify(cleanTitle)}-${randomUUID().slice(0, 6)}`;

        const project = await Project.create({
            title: cleanTitle,
            slug: projectSlug,
            category: category.trim(),
            location: location.trim(),
            description: description ? description.trim() : '',
            longDescription: longDescription ? longDescription.trim() : '',
            image: image.trim(),
            order: typeof order === 'number' && !isNaN(order) ? order : 0,
            published: typeof published === 'boolean' ? published : true,
        });

        revalidatePath('/');
        revalidatePath('/projects');
        return auth.getResponse(NextResponse.json({ success: true, project }));
    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const contentType = request.headers.get('content-type') || '';
        let id, title, category, location, description, longDescription, image, order, published;
        let file = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            id = formData.get('id')?.toString();
            title = formData.get('title')?.toString();
            category = formData.get('category')?.toString();
            location = formData.get('location')?.toString();
            description = formData.get('description')?.toString();
            longDescription = formData.get('longDescription')?.toString();
            image = formData.get('image')?.toString();
            if (formData.has('order')) {
                order = Number(formData.get('order'));
            }
            if (formData.has('published')) {
                published = formData.get('published') === 'true' || formData.get('published') === true;
            }
            const uploadedFile = formData.get('imageFile');
            if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
                file = uploadedFile;
            }
        } else {
            const json = await request.json();
            id = json.id;
            title = json.title;
            category = json.category;
            location = json.location;
            description = json.description;
            longDescription = json.longDescription;
            image = json.image;
            order = json.order;
            published = json.published;
        }

        if (!id) return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });

        await dbConnect();
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const updateData = {};
        if (typeof published === 'boolean') updateData.published = published;
        if (typeof order === 'number' && !isNaN(order)) updateData.order = order;
        if (title) updateData.title = title.trim();
        if (category) updateData.category = category.trim();
        if (location) updateData.location = location.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (longDescription !== undefined) updateData.longDescription = longDescription.trim();

        // Process uploaded image if provided
        if (file) {
            const uploaded = await processProjectImage(file);
            if (uploaded?.path) {
                updateData.image = uploaded.path;

                // Cleanup old storage file if stored in Supabase
                if (
                    existingProject.image &&
                    existingProject.image.startsWith('projects/') &&
                    existingProject.image !== uploaded.path
                ) {
                    const bucket = process.env.SUPABASE_BUCKET;
                    if (bucket) {
                        try {
                            await supabaseAdmin.storage.from(bucket).remove([existingProject.image]);
                        } catch (cleanErr) {
                            console.warn('Old project image cleanup failed:', cleanErr);
                        }
                    }
                }
            }
        } else if (image && image.trim()) {
            updateData.image = image.trim();
        }

        const updated = await Project.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        revalidatePath('/projects');
        if (updated?.slug) revalidatePath(`/projects/${updated.slug}`);

        return auth.getResponse(NextResponse.json({ success: true, project: updated }));
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await dbConnect();
        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

        // Cleanup storage image if it was hosted in Supabase
        if (project.image && project.image.startsWith('projects/')) {
            const bucket = process.env.SUPABASE_BUCKET;
            if (bucket) {
                try {
                    await supabaseAdmin.storage.from(bucket).remove([project.image]);
                } catch (storageErr) {
                    console.warn('Failed to delete project image from storage:', storageErr);
                }
            }
        }

        await Project.findByIdAndDelete(id);
        revalidatePath('/');
        revalidatePath('/projects');
        if (project.slug) revalidatePath(`/projects/${project.slug}`);

        return auth.getResponse(NextResponse.json({ success: true, message: 'Project deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
