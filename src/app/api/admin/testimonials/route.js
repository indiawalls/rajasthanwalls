import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import Testimonial from '@/models/Testimonial.mjs';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
        return auth.getResponse(NextResponse.json({ success: true, testimonials }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { name, role, quote, location, rating } = body || {};

        if (!name || !quote) {
            return NextResponse.json({ error: 'Name and quote are required' }, { status: 400 });
        }

        await dbConnect();
        const item = await Testimonial.create({
            name: name.trim(),
            role: (role || '').trim(),
            quote: quote.trim(),
            location: (location || '').trim(),
            rating: Number(rating) || 5,
            published: true,
            order: 0,
        });

        revalidatePath('/');
        return auth.getResponse(NextResponse.json({ success: true, testimonial: item }, { status: 201 }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { id, published, order, rating, quote, role, location, name } = body || {};

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await dbConnect();
        const updateData = {};
        if (typeof published === 'boolean') updateData.published = published;
        if (typeof order === 'number') updateData.order = order;
        if (typeof rating === 'number') updateData.rating = rating;
        if (quote) updateData.quote = quote.trim();
        if (role !== undefined) updateData.role = role.trim();
        if (name) updateData.name = name.trim();
        if (location !== undefined) updateData.location = location.trim();

        const updated = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        return auth.getResponse(NextResponse.json({ success: true, testimonial: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
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
        await Testimonial.findByIdAndDelete(id);
        revalidatePath('/');
        return auth.getResponse(NextResponse.json({ success: true, message: 'Testimonial deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
