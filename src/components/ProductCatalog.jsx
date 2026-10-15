import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';
import { getProducts, imageSrc } from '@/lib/products';

const defaultCatalog = [
    {
        title: 'Precast RCC Boundary Walls',
        slug: 'precast-rcc-boundary-wall',
        badge: 'Most Popular',
        description: 'Strong interlocked precast panels supported by pre-stressed concrete posts. Weather-proof and relocatable.',
        image: 'PreCastWallImage.webp',
        actionText: 'View Specs & Designs →',
    },
    {
        title: 'Designer Stone Texture Walls',
        slug: 'designer-boundary-wall',
        badge: 'Aesthetic Finish',
        description: 'Precast concrete molded with natural stone patterns. Ideal for farmhouses, villas, and premium commercial plots.',
        image: 'DesignerStoneWalls.webp',
        actionText: 'Explore Patterns →',
    },
    {
        title: 'Interlocking Paver Blocks',
        slug: 'interlocking-paver-blocks',
        badge: 'Heavy Duty',
        description: 'High-density interlocking concrete blocks built for industrial driveways, parking lots, and walkways.',
        image: 'PaverBlock%20Sols.jpg',
        actionText: 'View Thickness & Shapes →',
    },
    {
        title: 'Landscaping & Security Fencing',
        slug: 'chain-link-wire-mesh-fencing',
        badge: 'Outdoor Solutions',
        description: 'Elevate your outdoor spaces with our high-strength precast landscaping and perimeter solutions.',
        image: 'jan-canty-KcQuXaHCSPE-unsplash.jpg',
        actionText: 'Explore Solutions →',
    },
];

export default async function ProductCatalog() {
    const dbProducts = await getProducts();
    const catalogItems = dbProducts && dbProducts.length > 0
        ? dbProducts.slice(0, 6)
        : defaultCatalog;

    return (
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto" id="products">
            <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-5 leading-tight">Our Core Product Line</h2>
                <p className="text-lg sm:text-xl text-slate-700 leading-8">Engineered precast concrete solutions tailored for agricultural, commercial, and residential boundaries.</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
                {catalogItems.map((item, idx) => {
                    const imgSrc = item.image?.startsWith('http') || item.image?.startsWith('/')
                        ? item.image
                        : imageSrc(item.image);
                    const href = item.slug ? `/products/${item.slug}` : '/products';

                    return (
                        <AnimatedSection
                            key={item.id || item.slug || idx}
                            delay={0.15 + (idx % 4) * 0.08}
                            className="bg-white/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 group"
                        >
                            <div className="h-56 bg-slate-200 relative">
                                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                                    <Image
                                        src={imgSrc}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        unoptimized={typeof imgSrc === 'string' && imgSrc.startsWith('data:')}
                                    />
                                </div>
                            </div>
                            <div className="p-6">
                                {item.badge && (
                                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                        {item.badge}
                                    </span>
                                )}
                                <h3 className="text-xl font-bold mt-2 mb-2 group-hover:text-amber-600 transition">
                                    {item.title}
                                </h3>
                                <p className="text-slate-800 text-sm mb-4 line-clamp-2">
                                    {item.description}
                                </p>
                                <Link href={href} className="text-amber-600 font-semibold text-sm hover:underline">
                                    {item.actionText || 'View Specs & Designs →'}
                                </Link>
                            </div>
                        </AnimatedSection>
                    );
                })}
            </div>
        </section>
    );
}