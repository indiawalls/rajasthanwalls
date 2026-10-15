import Link from 'next/link';
import dynamic from 'next/dynamic';

const PrecastWallCanvas = dynamic(() => import('@/components/PrecastWallCanvas'));

export default function HeroSection() {
    return (
        <section className="relative bg-slate-100 text-slate-900 py-16 lg:py-20 px-4 sm:px-8 overflow-hidden min-h-145">

            {/* 1. 3D Rotating Dark Model Canvas */}
            <PrecastWallCanvas />

            {/* 2. Soft Light Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-100/95 via-slate-100/70 to-transparent z-10 pointer-events-none" />

            {/* 3. Foreground Content */}
            <div className="relative z-20 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">

                {/* Left Column Text (Reduced Sizes) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        ⚡ Over 2,000+ Projects Completed Across NCR & Rajasthan
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
                        High-Strength <span className="text-amber-600">Precast Boundary Walls</span> for Land & Industrial Security
                    </h1>

                    <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-8">
                        Fast, durable, and cost-effective readymade RCC boundary walls and paver blocks. Manufactured in state-of-the-art facilities and installed within days.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            href="/contact"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-center text-sm font-bold px-5 py-3 rounded-lg shadow-md transition"
                        >
                            Request Site Estimate
                        </Link>
                        <a
                            href="tel:+919950711475"
                            className="border border-slate-300 hover:border-slate-400 text-slate-800 text-center text-sm font-semibold px-5 py-3 rounded-lg transition bg-white/80 backdrop-blur-sm"
                        >
                            Call Engineer: 9950711475
                        </a>
                    </div>

                    {/* Micro Stats */}
                    <div className="grid grid-cols-3 gap-6 sm:gap-8 pt-6 border-t border-slate-300/70 max-w-md">
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-black leading-tight text-amber-600">10+ Yrs</p>
                            <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-700">Industry Experience</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-black leading-tight text-amber-600">50%</p>
                            <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-700">Faster Than Brickwork</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-black leading-tight text-amber-600">Low</p>
                            <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-700">Maintenance Cost</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}