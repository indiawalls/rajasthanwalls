import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost.mjs';

const slugify = (s) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 70);

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const blogs = await BlogPost.find().sort({ createdAt: -1 }).lean();
        return auth.getResponse(NextResponse.json({ success: true, blogs }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { title, excerpt, content, category, author, readTime, coverImage } = body || {};

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        await dbConnect();
        let slug = slugify(title);
        const existing = await BlogPost.findOne({ slug });
        if (existing) {
            slug = `${slug}-${Date.now().toString(36)}`;
        }

        const blog = await BlogPost.create({
            title: title.trim(),
            slug,
            excerpt: (excerpt || '').trim(),
            content: content.trim(),
            category: (category || 'Industry Insights').trim(),
            author: (author || 'Rajasthanwall Engineering Desk').trim(),
            readTime: (readTime || '4 min read').trim(),
            coverImage: (coverImage || '').trim(),
            published: true,
            publishedAt: new Date(),
        });

        revalidatePath('/');
        revalidatePath('/blog');
        return auth.getResponse(NextResponse.json({ success: true, blog }, { status: 201 }));
    } catch (err) {
        console.error('Failed to create blog post:', err);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}

export async function PATCH(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { id, title, excerpt, content, category, author, readTime, published, coverImage } = body || {};

        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        await dbConnect();
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
        if (content !== undefined) updateData.content = content.trim();
        if (category) updateData.category = category.trim();
        if (author) updateData.author = author.trim();
        if (readTime) updateData.readTime = readTime.trim();
        if (coverImage !== undefined) updateData.coverImage = coverImage.trim();
        if (typeof published === 'boolean') updateData.published = published;

        const updated = await BlogPost.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/');
        revalidatePath('/blog');
        return auth.getResponse(NextResponse.json({ success: true, blog: updated }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
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
        await BlogPost.findByIdAndDelete(id);
        revalidatePath('/');
        revalidatePath('/blog');
        return auth.getResponse(NextResponse.json({ success: true, message: 'Blog deleted' }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
