import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

export default function ProductCatalog() {
    return (
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto" id="products">
            <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-5 leading-tight">Our Core Product Line</h2>
                <p className="text-lg sm:text-xl text-slate-700 leading-8">Engineered precast concrete solutions tailored for agricultural, commercial, and residential boundaries.</p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">

                {/* Card 1 */}
                <AnimatedSection delay={0.15} className="bg-white/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 group">
                    <div className="h-56 bg-slate-200 relative">
                        {/* Replace with Next Image */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src={`${process.env.NEXT_PUBLIC_IMAGES}/PreCastWallImage.webp`} alt="Precase Wall Image" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Most Popular</span>
                        <h3 className="text-xl font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Precast RCC Boundary Walls</h3>
                        <p className="text-slate-800 text-sm mb-4">Strong interlocked precast panels supported by pre-stressed concrete posts. Weather-proof and relocatable.</p>
                        <Link href="/products" className="text-amber-600 font-semibold text-sm hover:underline">
                            View Specs & Designs →
                        </Link>
                    </div>
                </AnimatedSection>

                {/* Card 2 */}
                <AnimatedSection delay={0.23} className="bg-white/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 group">
                    <div className="h-56 bg-slate-200 relative">
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src={`${process.env.NEXT_PUBLIC_IMAGES}/DesignerStoneWalls.webp`} alt="Designer Stone Walls" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Aesthetic Finish</span>
                        <h3 className="text-xl font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Designer Stone Texture Walls</h3>
                        <p className="text-slate-800 text-sm mb-4">Precast concrete molded with natural stone patterns. Ideal for farmhouses, villas, and premium commercial plots.</p>
                        <Link href="/products" className="text-amber-600 font-semibold text-sm hover:underline">
                            Explore Patterns →
                        </Link>
                    </div>
                </AnimatedSection>

                {/* Card 3 */}
                <AnimatedSection delay={0.31} className="bg-white/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 group">
                    <div className="h-56 bg-slate-200 relative">
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src={`${process.env.NEXT_PUBLIC_IMAGES}/PaverBlock%20Sols.jpg`} alt="Paver Blocks" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Heavy Duty</span>
                        <h3 className="text-xl font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Interlocking Paver Blocks</h3>
                        <p className="text-slate-800 text-sm mb-4">High-density interlocking concrete blocks built for industrial driveways, parking lots, and walkways.</p>
                        <Link href="/products" className="text-amber-600 font-semibold text-sm hover:underline">
                            View Thickness & Shapes →
                        </Link>
                    </div>
                </AnimatedSection>

                {/* Card 4 */}
                <AnimatedSection delay={0.39} className="bg-white/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 group">
                    <div className="h-56 bg-slate-200 relative">
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src={`${process.env.NEXT_PUBLIC_IMAGES}/jan-canty-KcQuXaHCSPE-unsplash.jpg`} alt="Precast landscaping solutions" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Outdoor Solutions</span>
                        <h3 className="text-xl font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Landscaping</h3>
                        <p className="text-slate-800 text-sm mb-4">Elevate your outdoor spaces with our high-strength precast landscaping solutions.</p>
                        <Link href="/products" className="text-amber-600 font-semibold text-sm hover:underline">
                            Explore Solutions →
                        </Link>
                    </div>
                </AnimatedSection>

            </div>
        </section>
    )
}