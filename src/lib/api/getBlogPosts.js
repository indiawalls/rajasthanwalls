import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost.mjs';
import { blogPosts as fallbackBlogs } from '@/data/blogs';

export async function getBlogPosts(limit = 0) {
    try {
        await dbConnect();
        let query = BlogPost.find({ published: { $ne: false } }).sort({ order: 1, createdAt: -1 });
        if (limit > 0) {
            query = query.limit(limit);
        }
        const docs = await query.lean();

        if (docs && docs.length > 0) {
            return docs.map((b) => ({
                id: b._id.toString(),
                title: b.title,
                slug: b.slug,
                excerpt: b.excerpt || b.description || '',
                category: b.category || 'Engineering Guide',
                date: b.date || new Date(b.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: b.readTime || '4 min read',
                image: b.image
                    ? b.image.startsWith('http')
                        ? b.image
                        : `${process.env.NEXT_PUBLIC_IMAGES}/${b.image.replace(/^\/+/, '')}`
                    : `${process.env.NEXT_PUBLIC_IMAGES}/How-Precast-Walls-Save-Time-and-Add-Strength.png`,
            }));
        }
    } catch (e) {
        console.error('Failed to query blogposts from MongoDB, using fallback:', e.message);
    }

    const fallback = fallbackBlogs.map((b) => ({
        ...b,
        image: b.image.startsWith('http') ? b.image : `${process.env.NEXT_PUBLIC_IMAGES}/${b.image.replace(/^\/+images\/blogs\//, '').replace(/^\/+/, '')}`,
    }));

    return limit > 0 ? fallback.slice(0, limit) : fallback;
}
