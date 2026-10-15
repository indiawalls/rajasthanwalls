import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry.mjs';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
        return auth.getResponse(NextResponse.json({ success: true, inquiries }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { id, status } = body || {};

        if (!id || !['new', 'in-review', 'contacted', 'closed'].includes(status)) {
            return NextResponse.json({ error: 'Valid ID and status required.' }, { status: 400 });
        }

        await dbConnect();
        const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        return auth.getResponse(NextResponse.json({ success: true, inquiry: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 });
        }

        await dbConnect();
        await Inquiry.findByIdAndDelete(id);
        return auth.getResponse(NextResponse.json({ success: true, message: 'Inquiry deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
