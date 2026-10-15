import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.mjs';

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

async function processImageUpload(file) {
    if (!file || !(file instanceof File) || file.size === 0) {
        return null;
    }
    if (!EXT_BY_TYPE[file.type]) {
        throw new Error('Only JPG, PNG or WebP images are allowed.');
    }
    if (file.size > MAX_BYTES) {
        throw new Error('Image file must be 5MB or smaller.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isValidMagicBytes(buffer, file.type)) {
        throw new Error('Invalid or corrupted image file format.');
    }

    const ext = EXT_BY_TYPE[file.type] || 'webp';
    const storagePath = `products/${randomUUID()}.${ext}`;
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
            console.warn('[STORAGE] Supabase upload failed or storage is full, falling back to database:', uploadError.message);
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
        const products = await Product.find().sort({ order: 1, createdAt: -1 }).lean();
        return auth.getResponse(NextResponse.json({ success: true, products }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const contentType = request.headers.get('content-type') || '';
        let title, slug, badge, description, longDescription, image, specs, order, published;
        let file = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            title = formData.get('title')?.toString();
            slug = formData.get('slug')?.toString();
            badge = formData.get('badge')?.toString();
            description = formData.get('description')?.toString();
            longDescription = formData.get('longDescription')?.toString();
            image = formData.get('image')?.toString();
            specs = formData.get('specs')?.toString();
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
            slug = json.slug;
            badge = json.badge;
            description = json.description;
            longDescription = json.longDescription;
            image = json.image;
            specs = json.specs;
            order = json.order;
            published = json.published;
        }

        if (file) {
            const uploaded = await processImageUpload(file);
            if (uploaded?.path) {
                image = uploaded.path;
            }
        }

        if (!title || !slug || !description || !image) {
            return NextResponse.json(
                { error: 'Title, slug, description, and an image (or file upload) are required' },
                { status: 400 }
            );
        }

        await dbConnect();
        const parsedSpecs = Array.isArray(specs)
            ? specs
            : (typeof specs === 'string'
                ? specs.split('\n').map((s) => s.trim()).filter(Boolean)
                : []);

        const product = await Product.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            badge: badge ? badge.trim() : '',
            description: description.trim(),
            longDescription: longDescription ? longDescription.trim() : '',
            image: image.trim(),
            specs: parsedSpecs,
            order: typeof order === 'number' && !isNaN(order) ? order : 0,
            published: typeof published === 'boolean' ? published : true,
        });

        revalidatePath('/');
        revalidatePath('/products');
        return auth.getResponse(NextResponse.json({ success: true, product }));
    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const contentType = request.headers.get('content-type') || '';
        let id, title, slug, badge, description, longDescription, image, specs, order, published;
        let file = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            id = formData.get('id')?.toString();
            title = formData.get('title')?.toString();
            slug = formData.get('slug')?.toString();
            badge = formData.get('badge')?.toString();
            description = formData.get('description')?.toString();
            longDescription = formData.get('longDescription')?.toString();
            image = formData.get('image')?.toString();
            specs = formData.get('specs')?.toString();
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
            slug = json.slug;
            badge = json.badge;
            description = json.description;
            longDescription = json.longDescription;
            image = json.image;
            specs = json.specs;
            order = json.order;
            published = json.published;
        }

        if (!id) return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });

        await dbConnect();
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const updateData = {};
        if (typeof published === 'boolean') updateData.published = published;
        if (typeof order === 'number' && !isNaN(order)) updateData.order = order;
        if (title) updateData.title = title.trim();
        if (slug) updateData.slug = slug.trim().toLowerCase();
        if (badge !== undefined) updateData.badge = badge.trim();
        if (description) updateData.description = description.trim();
        if (longDescription !== undefined) updateData.longDescription = longDescription.trim();

        if (specs !== undefined) {
            updateData.specs = Array.isArray(specs)
                ? specs
                : specs.split('\n').map((s) => s.trim()).filter(Boolean);
        }

        // Handle file upload if provided
        if (file) {
            const uploaded = await processImageUpload(file);
            if (uploaded?.path) {
                updateData.image = uploaded.path;

                // Cleanup previous storage file if it was in Supabase storage
                if (
                    existingProduct.image &&
                    existingProduct.image.startsWith('products/') &&
                    existingProduct.image !== uploaded.path
                ) {
                    const bucket = process.env.SUPABASE_BUCKET;
                    if (bucket) {
                        try {
                            await supabaseAdmin.storage.from(bucket).remove([existingProduct.image]);
                        } catch (cleanErr) {
                            console.warn('Old image cleanup failed:', cleanErr);
                        }
                    }
                }
            }
        } else if (image && image.trim()) {
            updateData.image = image.trim();
        }

        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        revalidatePath('/products');
        if (updated?.slug) revalidatePath(`/products/${updated.slug}`);
        if (existingProduct.slug && existingProduct.slug !== updated?.slug) {
            revalidatePath(`/products/${existingProduct.slug}`);
        }

        return auth.getResponse(NextResponse.json({ success: true, product: updated }));
    } catch (err) {
        if (err.code === 11000) {
            return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
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
        const product = await Product.findById(id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        // Cleanup storage image if it was hosted in Supabase
        if (product.image && product.image.startsWith('products/')) {
            const bucket = process.env.SUPABASE_BUCKET;
            if (bucket) {
                try {
                    await supabaseAdmin.storage.from(bucket).remove([product.image]);
                } catch (storageErr) {
                    console.warn('Failed to delete product image from storage:', storageErr);
                }
            }
        }

        await Product.findByIdAndDelete(id);
        revalidatePath('/');
        revalidatePath('/products');
        if (product.slug) revalidatePath(`/products/${product.slug}`);

        return auth.getResponse(NextResponse.json({ success: true, message: 'Product deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
