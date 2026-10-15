import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogs';

// ⚡ Static Site Generation (SSG) for instant mobile loading & 90+ Lighthouse score
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

// ⚡ Automated SEO Metadata per blog post
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = blogPosts.find((b) => b.slug === slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Rajasthanwall Infratech`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function DynamicBlogPostPage({ params }) {
    const { slug } = await params;
    const post = blogPosts.find((b) => b.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Navigation Breadcrumb */}
                <Link
                    href="/blog"
                    className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-amber-700 transition mb-6"
                >
                    <span>← Back to Articles</span>
                </Link>

                {/* Header Information */}
                <header className="space-y-4 mb-8">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                            {post.category}
                        </span>
                        {post.locationTag && (
                            <span className="font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
                                📍 {post.locationTag}
                            </span>
                        )}
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{post.readTime}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-slate-500 text-xs">
                        Published on <span className="font-semibold text-slate-800">{post.date}</span> by{' '}
                        <span className="font-semibold text-slate-800">{post.author}</span>
                    </p>
                </header>

                {/* Optimized Featured Image */}
                <div className="relative w-full h-87.5 sm:h-112.5 rounded-2xl overflow-hidden mb-10 shadow-md bg-slate-200">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 1200px) 100vw, 900px"
                    />
                </div>

                {/* Dynamic Article Content */}
                <div
                    className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-6 prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl prose-h3:text-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer Call to Action */}
                <div className="mt-14 p-6 sm:p-8 bg-slate-900 text-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            Planning a project in Alwar, Bhiwadi, or NCR?
                        </h3>
                        <p className="text-xs text-slate-400">
                            Get an instant cost-per-square-foot estimate directly from our engineering team.
                        </p>
                    </div>
                    <a
                        href="https://wa.me/917820879777"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition"
                    >
                        Get Factory Quote
                    </a>
                </div>

            </div>
        </article>
    );
}