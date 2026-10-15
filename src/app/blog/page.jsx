import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';
import { blogPosts as fallbackBlogs } from '@/data/blogs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: 'Precast Boundary Walls & Concrete Engineering Blog | Rajasthanwall Infratech',
    description:
        'Technical guides, cost comparisons, and construction insights on precast concrete boundary walls, RCC compound walls, and paver blocks across Rajasthan and Delhi NCR.',
};

async function getArticles() {
    try {
        await dbConnect();
        const db = mongoose.connection.db;
        const liveBlogs = await db.collection('blogposts').find({ published: { $ne: false } }).toArray();
        if (liveBlogs && liveBlogs.length > 0) {
            return liveBlogs.map((b) => ({
                id: b._id.toString(),
                title: b.title,
                slug: b.slug,
                excerpt: b.excerpt || b.description || '',
                category: b.category || 'Engineering Guide',
                date: b.date || new Date(b.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: b.readTime || '4 min read',
                image: b.image ? (b.image.startsWith('http') ? b.image : `${process.env.NEXT_PUBLIC_IMAGES}/${b.image.replace(/^\/+/, '')}`) : `${process.env.NEXT_PUBLIC_IMAGES}/How-Precast-Walls-Save-Time-and-Add-Strength.png`,
            }));
        }
    } catch (e) {
        console.error('Failed to query blogposts from MongoDB, using fallback:', e.message);
    }

    return fallbackBlogs.map((b) => ({
        ...b,
        image: b.image.startsWith('http') ? b.image : `${process.env.NEXT_PUBLIC_IMAGES}/${b.image.replace(/^\/+images\/blogs\//, '').replace(/^\/+/, '')}`,
    }));
}

export default async function BlogIndexPage() {
    const articles = await getArticles();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            <Navbar />

            {/* Header Banner */}
            <section className="bg-slate-900 text-white py-8 sm:py-12 px-4 border-b-2 border-yellow-400">
                <div className="max-w-4xl mx-auto text-center space-y-2.5 sm:space-y-3">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                        Technical Insights & Case Studies
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                        Engineering & Construction Blog
                    </h1>
                    <div className="mx-auto h-1 w-10 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                        In-depth cost comparisons, installation best practices, and durability analyses for precast boundary walls, RCC compound systems, and industrial paver solutions.
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((post) => (
                        <article
                            key={post.slug}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-yellow-400/80 transition-all duration-300 flex flex-col group"
                        >
                            <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur text-yellow-300 text-[11px] font-bold px-2.5 py-1 rounded-md">
                                    {post.category}
                                </span>
                            </Link>

                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-yellow-600 transition leading-snug">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="pt-6 mt-4 border-t border-slate-100">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 group-hover:text-yellow-700 transition"
                                    >
                                        <span>Read Complete Article</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
