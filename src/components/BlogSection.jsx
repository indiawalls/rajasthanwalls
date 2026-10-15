import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import { getBlogPosts } from '@/lib/api/getBlogPosts';

export default async function BlogSection() {
    const posts = await getBlogPosts(3);

    return (
        <section className="py-20 border-b border-slate-200" id="blog">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
                    <div className="max-w-xl space-y-3">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                            Knowledge Hub
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
                            Latest Articles & Technical Insights
                        </h2>
                        <p className="text-slate-700 text-sm sm:text-base">
                            Expert advice on precast manufacturing, boundary wall installation standards, and industrial site security.
                        </p>
                    </div>
                </AnimatedSection>

                {/* BLOG CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <AnimatedSection
                            key={post.id || post.slug || idx}
                            delay={0.15 + idx * 0.08}
                            className="bg-white/90 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                {/* CARD IMAGE CONTAINER */}
                                <div className="relative w-full h-48 sm:h-52 bg-slate-200 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className=" group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* CARD CONTENT */}
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>

                                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>

                            {/* CARD FOOTER */}
                            <div className="px-6 pb-6 pt-2">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-amber-700 transition space-x-1"
                                >
                                    <span>Read Article</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
}