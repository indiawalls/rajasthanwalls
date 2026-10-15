import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import SiteSetting from '@/models/SiteSetting.mjs';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const settings = await SiteSetting.find().lean();
        return auth.getResponse(NextResponse.json({ success: true, settings }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { key, value, description } = body || {};

        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
        }

        await dbConnect();
        const updated = await SiteSetting.findOneAndUpdate(
            { key },
            { $set: { value, description: description || '', updatedAt: new Date() } },
            { upsert: true, new: true }
        );

        revalidatePath('/');
        revalidatePath('/contact');
        return auth.getResponse(NextResponse.json({ success: true, setting: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
