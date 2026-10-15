import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProductCementPlank = dynamic(() => import('@/components/ProductCementPlank'));
const ColumnProductPage = dynamic(() => import('@/components/ColumnProductPage'));
const CompoundWallPage = dynamic(() => import('@/components/CompoundWallPage'));

import { getSiteSettings } from '@/lib/api/getSiteSettings';

export const metadata = {
    title: 'Product Specifications & 3D Models | Rajasthanwall Infratech',
    description:
        'Explore detailed specifications and interactive 3D models for precast cement panels, RCC columns, and compound walls.',
};

// Labels for the quick-jump bar.
const specSections = [
    { id: 'cement-sets', label: 'Cement Sets (Panel)', Component: ProductCementPlank },
    { id: 'rcc-columns', label: 'RCC Columns', Component: ColumnProductPage },
    { id: 'compound-walls', label: 'Compound Walls', Component: CompoundWallPage },
];

export default async function SpecificationsPage() {
    const contactInfo = await getSiteSettings('contact_info');
    const whatsappClean = (contactInfo?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
    const whatsappHref = `https://wa.me/${whatsappClean}?text=${encodeURIComponent("Hi, I'd like a quote based on your product specifications.")}`;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
            <Navbar />

            {/* Banner */}
            <section className="border-b border-slate-800 bg-slate-900 px-4 py-8 sm:py-12 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl space-y-2.5">
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Product Specifications</h1>
                    <div className="mx-auto h-1 w-10 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Explore interactive 3D models and detailed specifications for our precast RCC products.
                    </p>
                </div>
            </section>

            {/* Sticky quick-jump bar */}
            <nav
                aria-label="Product specifications"
                style={{ top: 'var(--navbar-offset, 5rem)' }}
                className="sticky z-30 border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs transition-[top] duration-300 ease-in-out"
            >
                <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
                    {specSections.map(({ id, label }) => (
                        <li key={id} className="shrink-0">
                            <a
                                href={`#${id}`}
                                className="inline-block rounded-full border border-slate-300 px-3.5 py-1 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main content */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
                <div className="space-y-16">
                    {specSections.map(({ id, label, Component }) => (
                        <section key={id} id={id} className="scroll-mt-16">
                            <h2 className="sr-only">{label}</h2>
                            <Component />
                        </section>
                    ))}
                </div>

                {/* Next step */}
                <section className="rounded-2xl bg-slate-900 px-6 py-12 text-center sm:px-10 mt-16">
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Need a custom size or a quote?</h2>
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 text-balance">
                        Tell us your site requirements and we&apos;ll recommend the right panel, column, or wall system.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Send Enquiry
                        </Link>
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            WhatsApp Quote
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}