import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.mjs';
import mongoose from 'mongoose';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    // Static site routes
    const staticPaths = [
        '',
        '/about',
        '/products',
        '/specifications',
        '/why-us',
        '/projects',
        '/blog',
        '/contact'
    ];

    const routes = staticPaths.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    let dynamicRoutes = [];

    try {
        await dbConnect();
        const db = mongoose.connection.db;

        // Fetch live product slugs
        const products = await Product.find({ published: true }).select('slug updatedAt').lean();
        const productRoutes = products.map((p) => ({
            url: `${baseUrl}/products/${p.slug}`,
            lastModified: p.updatedAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        }));

        // Fetch live blog slugs
        const blogs = await db.collection('blogposts').find({ published: { $ne: false } }).project({ slug: 1, updatedAt: 1 }).toArray();
        const blogRoutes = blogs.map((b) => ({
            url: `${baseUrl}/blog/${b.slug}`,
            lastModified: b.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

        dynamicRoutes = [...productRoutes, ...blogRoutes];
    } catch (e) {
        console.error('Failed to generate dynamic sitemap routes:', e.message);
    }

    return [...routes, ...dynamicRoutes];
}