import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project.mjs';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { id, published, order, title, location, category } = body || {};

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await dbConnect();
        const updateData = {};
        if (typeof published === 'boolean') updateData.published = published;
        if (typeof order === 'number') updateData.order = order;
        if (title) updateData.title = title.trim();
        if (location) updateData.location = location.trim();
        if (category) updateData.category = category.trim();

        const updated = await Project.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        revalidatePath('/projects');
        return auth.getResponse(NextResponse.json({ success: true, project: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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

        // Cleanup storage image
        if (project.image) {
            try {
                const bucket = process.env.SUPABASE_BUCKET;
                await supabaseAdmin.storage.from(bucket).remove([project.image]);
            } catch (storageErr) {
                console.warn('Failed to delete project image from storage:', storageErr);
            }
        }

        await Project.findByIdAndDelete(id);
        revalidatePath('/');
        revalidatePath('/projects');
        return auth.getResponse(NextResponse.json({ success: true, message: 'Project deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
