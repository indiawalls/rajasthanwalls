import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.mjs';

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
        const body = await request.json();
        const { title, slug, badge, description, longDescription, image, specs, order, published } = body || {};

        if (!title || !slug || !description || !image) {
            return NextResponse.json({ error: 'Title, slug, description, and image are required' }, { status: 400 });
        }

        await dbConnect();
        const product = await Product.create({
            title: title.trim(),
            slug: slug.trim().toLowerCase(),
            badge: badge ? badge.trim() : '',
            description: description.trim(),
            longDescription: longDescription ? longDescription.trim() : '',
            image: image.trim(),
            specs: Array.isArray(specs) ? specs : (specs ? specs.split('\n').map((s) => s.trim()).filter(Boolean) : []),
            order: typeof order === 'number' ? order : 0,
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
        const body = await request.json();
        const { id, title, slug, badge, description, longDescription, specs, order, published } = body || {};

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await dbConnect();
        const updateData = {};
        if (typeof published === 'boolean') updateData.published = published;
        if (typeof order === 'number') updateData.order = order;
        if (title) updateData.title = title.trim();
        if (slug) updateData.slug = slug.trim().toLowerCase();
        if (badge !== undefined) updateData.badge = badge.trim();
        if (description) updateData.description = description.trim();
        if (longDescription !== undefined) updateData.longDescription = longDescription.trim();
        if (specs !== undefined) {
            updateData.specs = Array.isArray(specs) ? specs : specs.split('\n').map((s) => s.trim()).filter(Boolean);
        }

        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        revalidatePath('/products');
        return auth.getResponse(NextResponse.json({ success: true, product: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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
        await Product.findByIdAndDelete(id);
        revalidatePath('/');
        revalidatePath('/products');
        return auth.getResponse(NextResponse.json({ success: true, message: 'Product deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
