import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { getProducts, imageSrc } from '@/lib/products';

const themes = [
    {
        // Light concrete
        section: 'bg-slate-100',
        title: 'text-slate-900',
        body: 'text-slate-600',
        chip: 'bg-white text-slate-700 border-slate-200',
        badge: 'bg-slate-900 text-yellow-300',
        primary: 'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900',
    },
    {
        // Warm sand
        section: 'bg-amber-50',
        title: 'text-slate-900',
        body: 'text-slate-700',
        chip: 'bg-white text-amber-900 border-amber-200',
        badge: 'bg-slate-900 text-yellow-300',
        primary: 'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900',
    },
    {
        // Dark navy
        section: 'bg-slate-900',
        title: 'text-white',
        body: 'text-slate-300',
        chip: 'bg-slate-800 text-slate-200 border-slate-700',
        badge: 'bg-yellow-400 text-slate-900',
        primary: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 focus-visible:outline-white',
    },
    {
        // Cool steel grey
        section: 'bg-zinc-200',
        title: 'text-slate-900',
        body: 'text-slate-700',
        chip: 'bg-white text-slate-700 border-zinc-300',
        badge: 'bg-slate-900 text-yellow-300',
        primary: 'bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900',
    },
    {
        // Deep green (landscaping)
        section: 'bg-emerald-900',
        title: 'text-white',
        body: 'text-emerald-100',
        chip: 'bg-emerald-800 text-emerald-50 border-emerald-600',
        badge: 'bg-yellow-400 text-slate-900',
        primary: 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 focus-visible:outline-white',
    },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="flex min-h-screen flex-col text-slate-800">
            <Navbar />

            {/* Top banner */}
            <section className="border-b border-slate-800 bg-slate-900 px-4 py-8 sm:py-12 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl space-y-2.5">
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Our Products</h1>
                    <div className="mx-auto h-1 w-10 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-300 leading-relaxed">
                        High-durability precast RCC panels, interlocking pavers, and perimeter security fencing
                        manufactured in Alwar, Rajasthan.
                    </p>
                </div>
            </section>

            {/* Sticky quick-jump bar (pure anchor links, no JS) */}
            <nav
                aria-label="Product categories"
                style={{ top: 'var(--navbar-offset, 5rem)' }}
                className="sticky z-30 border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs transition-[top] duration-300 ease-in-out"
            >
                <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
                    {products.map((item) => (
                        <li key={item.id} className="shrink-0">
                            <a
                                href={`#${item.slug}`}
                                className="inline-block rounded-full border border-slate-300 px-3.5 py-1 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}

                </ul>
            </nav>

            <main className="grow">
                {products.length === 0 ? (
                    <p className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-600 sm:px-6 lg:px-8">
                        No products are available right now.
                    </p>
                ) : products.map((item, index) => {
                    const t = themes[index % themes.length];
                    const imageRight = index % 2 === 1;

                    return (
                        <section
                            key={item.id}
                            id={item.slug}
                            className={`${t.section} scroll-mt-16 px-4 py-14 sm:px-6 lg:flex lg:min-h-[85svh] lg:items-center lg:px-8 lg:py-20`}
                        >
                            <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-16">
                                {/* Image: always first on mobile, alternates sides on desktop */}
                                <Link
                                    href={`/products/${item.slug}`}
                                    className={`group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-xl ${imageRight ? 'lg:order-2' : 'lg:order-1'
                                        }`}
                                >
                                    <img
                                        src={imageSrc(item.image)}
                                        alt={item.title}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                    />
                                </Link>

                                {/* Text */}
                                <div className={imageRight ? 'lg:order-1' : 'lg:order-2'}>
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${t.badge}`}>
                                        {item.badge}
                                    </span>
                                    <h2 className={`mt-4 text-3xl font-extrabold leading-tight sm:text-4xl ${t.title}`}>
                                        {item.title}
                                    </h2>
                                    <div className="mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                                    <p className={`mt-5 text-lg leading-relaxed ${t.body}`}>{item.description}</p>

                                    <ul className="mt-6 flex flex-wrap gap-2">
                                        {item.specs.map((spec) => (
                                            <li
                                                key={spec}
                                                className={`rounded-md border px-3 py-1.5 text-sm font-medium ${t.chip}`}
                                            >
                                                {spec}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8 flex flex-wrap items-center gap-3">
                                        <Link
                                            href="/contact"
                                            className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.primary}`}
                                        >
                                            Send Enquiry
                                        </Link>
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className={`px-2 py-3 text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 ${t.title}`}
                                        >
                                            View details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-900 py-8 text-md text-slate-400">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                    <div>
                        <p className="font-semibold text-slate-300">RajasthanWall Manufacturing Unit</p>
                        <p className="mt-1">Near Gyan Sagar, Alampur, Kotkasim, Rajasthan.</p>
                    </div>
                    <p className="text-slate-500">Copyright © 2026 RajasthanWall. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}