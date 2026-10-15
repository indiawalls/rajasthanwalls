import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import Faq from '@/models/Faq.mjs';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const faqs = await Faq.find().sort({ order: 1, createdAt: 1 }).lean();
        return auth.getResponse(NextResponse.json({ success: true, faqs }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}

export async function POST(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { question, answer, category } = body || {};

        if (!question || !answer) {
            return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
        }

        await dbConnect();
        const count = await Faq.countDocuments();
        const faq = await Faq.create({
            question: question.trim(),
            answer: answer.trim(),
            category: (category || 'General').trim(),
            order: count,
            published: true,
        });

        revalidatePath('/');
        return auth.getResponse(NextResponse.json({ success: true, faq }, { status: 201 }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { id, question, answer, category, published, order } = body || {};

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await dbConnect();
        const updateData = {};
        if (question) updateData.question = question.trim();
        if (answer) updateData.answer = answer.trim();
        if (category) updateData.category = category.trim();
        if (typeof published === 'boolean') updateData.published = published;
        if (typeof order === 'number') updateData.order = order;

        const updated = await Faq.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        return auth.getResponse(NextResponse.json({ success: true, faq: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
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
        await Faq.findByIdAndDelete(id);
        revalidatePath('/');
        return auth.getResponse(NextResponse.json({ success: true, message: 'FAQ deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
    }
}
