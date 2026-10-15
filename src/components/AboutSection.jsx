import Image from 'next/image';

export default function AboutSection() {
    return (
        <section className="py-24 border-y border-slate-200" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* MAIN FOUNDER & STORY GRID */}
                <div className="grid lg:grid-cols-12 gap-16 items-center mb-20">

                    {/* Founder Image Frame */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-100 aspect-4/5">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGES}/CEO-768x1024.webp.bv.webp`}
                                alt="Rohit Kumar Yadav - Founder & CEO of Indiawalls Infratech"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                loading='eager'
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                                <p className="text-xl font-bold">Rohit Kumar Yadav</p>
                                <p className="text-sm text-amber-400 font-medium">Founder & CEO, Indiawalls Infratech</p>
                            </div>
                        </div>
                    </div>

                    {/* About Content */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-block text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                            Established in 2016
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black text-[#1c2024] leading-tight">
                            Pioneering Durable Precast Security & Construction Solutions Across NCR
                        </h2>

                        <p className="text-lg sm:text-xl text-[#1f4e5f] leading-8">
                            Founded in 2016 by <strong className="text-[#1f4e5f]">Rohit Kumar Yadav</strong>, Indiawalls Infratech Private Limited was established to enhance security solutions for properties across Rajasthan and Delhi NCR. Recognizing the growing demand for secure, eco-friendly, and sustainable boundary wall options, we expanded our manufacturing capabilities in 2017 to include specialized precast RCC walls, barbed fencing, and interlocking paver blocks.
                        </p>

                        <p className="text-lg sm:text-xl text-[#1f4e5f] leading-8">
                            Today, with over 2,000 satisfied clients and manufacturing plants across NCR, Alwar, Bhiwadi, Gurugram, Bhadurgarh, Palwal, Ramgarh, Kotkasim, Ringus, Faridabad and Mathura we specialize in delivering relocatable, high-strength concrete walls engineered for rapid deployment.
                        </p>
                    </div>
                </div>

                {/* MISSION & VISION CARDS */}
                <div className="grid md:grid-cols-2 gap-10">

                    {/* Mission */}
                    <div className="bg-white/90 border border-slate-200 rounded-2xl p-9 space-y-5 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🎯
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Mission</h3>
                        <p className="text-lg sm:text-xl text-slate-800 leading-8">
                            To provide high-quality, innovative, and customizable precast wall and fencing solutions that ensure safety, structural efficiency, and long-term security for our clients across industrial and agricultural land developments.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-white/90 border border-slate-200 rounded-2xl p-9 space-y-5 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            👁️
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Vision</h3>
                        <p className="text-lg sm:text-xl text-slate-800 leading-8">
                            To be the leading precast wall and security fencing manufacturer in India, recognized for structural reliability, technical excellence, and unmatched customer satisfaction across all infrastructure initiatives.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}