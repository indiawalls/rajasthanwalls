import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Zap, ShieldCheck, Coins, Ruler, Pin, CloudRain, Dumbbell, Truck, Wrench, CheckCircle2, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getProductDetail, assetSrc } from '@/lib/api/getProductDetails';
import { getProductBySlug, getProducts, imageSrc } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PHONE_DISPLAY = '+91 9950711475';
const PHONE_HREF = 'tel:+919950711475';

// The database stores a short key; the icon component lives here.
const icons = { zap: Zap, shield: ShieldCheck, coins: Coins, ruler: Ruler, pin: Pin, rain: CloudRain, strength: Dumbbell, truck: Truck, wrench: Wrench };

export async function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }) {
    const { slug } = await params; 
    const [product, detail] = await Promise.all([getProductBySlug(slug), getProductDetail(slug)]);
    if (!product) return { title: 'Product not found | RajasthanWall' };
    return {
        title: detail?.seoTitle || `${product.title} | RajasthanWall`,
        description: detail?.seoDescription || product.description,
    };
}

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    const [product, detail] = await Promise.all([getProductBySlug(slug), getProductDetail(slug)]);
    if (!product) notFound();

    const hero = detail?.hero || {};
    const heroImage = hero.image?.src ? assetSrc(hero.image.src) : imageSrc(product.image);
    const captions = hero.captions?.length ? hero.captions : hero.caption ? [hero.caption] : [];

    // Installation steps may be plain strings (older data) or { title, description }
    const installSteps = (detail?.installationSteps || []).map((s) => (typeof s === 'string' ? { title: s } : s));
    const installHasText = installSteps.some((s) => s.description);

    // Full class names so Tailwind can detect them
    const variantCount = detail?.variants?.length || 0;
    const variantCols = variantCount === 4 ? 'lg:grid-cols-4' : variantCount === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

    const others = (await getProducts()).filter((p) => p.slug !== product.slug).slice(0, 4);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Hero */}
            <section className="bg-slate-900 px-4 py-8 sm:py-14 text-white">
                <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
                    <div>
                        <Link
                            href="/products"
                            className="text-xs sm:text-sm font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline"
                        >
                            ← All products
                        </Link>
                        {(hero.eyebrow || product.badge) && (
                            <span className="mt-3 block w-fit rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-slate-900">
                                {hero.eyebrow || product.badge}
                            </span>
                        )}
                        <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            {hero.title || product.title}
                        </h1>
                        <div className="mt-3 h-1 w-10 rounded-full bg-yellow-400" aria-hidden="true" />
                        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                            {hero.intro || product.description}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/contact"
                                className="rounded-lg bg-yellow-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                {hero.ctaLabel || 'Get Quick Quote'}
                            </Link>
                            <a
                                href={PHONE_HREF}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <Phone size={18} aria-hidden="true" />
                                Call {PHONE_DISPLAY}
                            </a>
                        </div>
                    </div>

                    <div className="relative h-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl sm:h-96">
                        <img
                            src={heroImage}
                            alt={hero.image?.alt || product.title}
                            className="h-full w-full object-cover"
                        />
                        {captions.length > 0 && (
                            <ul className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                {captions.map((c) => (
                                    <li
                                        key={c}
                                        className="rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur-md"
                                    >
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            {detail?.benefits?.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        {detail.benefitsTitle && (
                            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{detail.benefitsTitle}</h2>
                        )}
                        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                        {detail.benefitsIntro && (
                            <p className="mt-5 text-base text-slate-600 text-balance sm:text-lg">{detail.benefitsIntro}</p>
                        )}
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {detail.benefits.map((b) => {
                            const Icon = icons[b.icon] || CheckCircle2;
                            return (
                                <div key={b.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-yellow-400">
                                        <Icon size={24} aria-hidden="true" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-slate-900">{b.title}</h3>
                                    <p className="text-base leading-relaxed text-slate-600">{b.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Variants / options */}
            {detail?.variants?.length > 0 && (
                <section className="border-y border-slate-200 bg-slate-100 px-4 py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10">
                            {detail.variantsTitle && (
                                <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{detail.variantsTitle}</h2>
                            )}
                            <div className="mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                            {detail.variantsIntro && (
                                <p className="mt-5 text-base text-slate-600 sm:text-lg">{detail.variantsIntro}</p>
                            )}
                        </div>
                        <ul
                            className={`grid gap-6 md:grid-cols-2 ${variantCols}`}
                        >
                            {detail.variants.map((v) => (
                                <li
                                    key={v.name}
                                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div>
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                            {v.spec && (
                                                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                                    {v.spec}
                                                </span>
                                            )}
                                            {v.badge && (
                                                <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-bold text-yellow-300">
                                                    {v.badge}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mb-2 text-lg font-bold text-slate-900">{v.name}</h3>
                                        <p className="mb-4 text-base leading-relaxed text-slate-600">{v.description}</p>
                                    </div>
                                    {v.bestFor && (
                                        <p className="border-t border-slate-100 pt-4 text-sm text-slate-600">
                                            <span className="font-semibold text-slate-900">Best for: </span>
                                            {v.bestFor}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Specs + manufacturing process */}
            {(detail?.technicalSpecs?.length > 0 || detail?.manufacturingSteps?.length > 0) && (
                <section className="border-b border-slate-200 bg-white px-4 py-16">
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
                        {detail.technicalSpecs?.length > 0 && (
                            <div>
                                <h2 className="mb-6 text-2xl font-extrabold text-slate-900">{detail.specsTitle}</h2>
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <table className="w-full text-left text-base">
                                        <tbody>
                                            {detail.technicalSpecs.map((s) => (
                                                <tr key={s.feature} className="border-b border-slate-100 last:border-0">
                                                    <th scope="row" className="px-5 py-3.5 font-semibold text-slate-900">
                                                        {s.feature}
                                                    </th>
                                                    <td className="px-5 py-3.5 text-slate-600">{s.detail}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {detail.manufacturingSteps?.length > 0 && (
                            <div>
                                <h2 className="mb-6 text-2xl font-extrabold text-slate-900">{detail.processTitle}</h2>
                                <ol className="space-y-4">
                                    {detail.manufacturingSteps.map((s, i) => (
                                        <li
                                            key={s.title}
                                            className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row"
                                        >
                                            <div className="flex flex-1 items-start gap-4">
                                                <span className="rounded-lg bg-yellow-100 px-3 py-1 text-lg font-extrabold text-slate-900">
                                                    {s.step || String(i + 1).padStart(2, '0')}
                                                </span>
                                                <div>
                                                    <h3 className="mb-1 text-base font-bold text-slate-900">{s.title}</h3>
                                                    <p className="text-base leading-relaxed text-slate-600">{s.description}</p>
                                                </div>
                                            </div>
                                            {s.image && (
                                                <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl border border-slate-100 sm:w-28">
                                                    <img
                                                        src={assetSrc(s.image)}
                                                        alt={s.title}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Gallery */}
            {detail?.gallery?.length > 0 && (
                <section className="bg-white px-4 py-12 sm:py-16">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
                            More image gallery
                        </h2>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {detail.gallery.map((img) => (
                                <li key={img.src} className="min-w-0 overflow-hidden rounded-xl border border-slate-200">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={assetSrc(img.src)}
                                            alt={img.alt || product.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    {img.caption && <p className="p-3 text-sm text-slate-600">{img.caption}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Installation: a numbered list when steps have descriptions, compact cards when they don't */}
            {installSteps.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16">
                    {detail.installationTitle && (
                        <h2 className="mb-10 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
                            {detail.installationTitle}
                        </h2>
                    )}
                    {installHasText ? (
                        <ol className="mx-auto max-w-4xl space-y-4">
                            {installSteps.map((s, i) => (
                                <li
                                    key={s.title}
                                    className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
                                >
                                    <div className="flex flex-1 items-start gap-4">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-yellow-400">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h3 className="mb-1 text-base font-bold text-slate-900">{s.title}</h3>
                                            {s.description && (
                                                <p className="text-base leading-relaxed text-slate-600">{s.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    {s.image && (
                                        <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl border border-slate-100 sm:w-28">
                                            <img
                                                src={assetSrc(s.image)}
                                                alt={s.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {installSteps.map((s, i) => (
                                <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-yellow-400">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-800">{s.title}</h3>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            )}

            {/* Call to action */}
            <section className="bg-slate-900 px-4 py-16 text-center text-white">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-2xl font-extrabold sm:text-3xl">{detail?.cta?.title || 'Request an Instant Quote'}</h2>
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mt-5 text-base text-slate-300 text-balance sm:text-lg">
                        {detail?.cta?.text || 'Send us your site details and dimensions for a customized cost estimate.'}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="rounded-lg bg-yellow-400 px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                        >
                            Send Enquiry
                        </Link>
                        <a
                            href={PHONE_HREF}
                            className="rounded-lg border border-slate-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                        >
                            Call {PHONE_DISPLAY}
                        </a>
                    </div>
                </div>
            </section>

            {/* More products */}
            {others.length > 0 && (
                <section className="border-t border-slate-200 bg-white px-4 py-14">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="text-2xl font-extrabold text-slate-900">More products</h2>
                        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {others.map((p) => (
                                <li key={p.slug}>
                                    <Link
                                        href={`/products/${p.slug}`}
                                        className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-slate-900"
                                    >
                                        <div className="aspect-4/3 overflow-hidden bg-slate-100">
                                            <img
                                                src={imageSrc(p.image)}
                                                alt={p.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                                            />
                                        </div>
                                        <p className="p-4 font-bold text-slate-900">{p.title}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

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
