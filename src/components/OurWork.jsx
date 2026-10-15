'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';

const projects = [
    {
        title: 'Industrial Area, Chopanki, Bhiwadi',
        location: 'Bhiwadi, Rajasthan',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/another-precast-project.webp`,
    },
    {
        title: 'Agriculture Wall, M.I.A Alwar',
        location: 'Alwar, Rajasthan',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/MIAAlwar.webp`,
    },
    {
        title: 'Precast Boundary Wall, Sector 74',
        location: 'Gurugram, Haryana',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/Gurugram.webp`,
    },
    {
        title: 'Compound Wall Project, Dayalpur',
        location: 'Faridabad, Haryana',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/Dayalpur.webp`,
    },
    {
        title: 'Mahwa, Near Sikandra',
        location: 'Dausa, Rajasthan',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/Mahwa.webp`,
    },
    {
        title: 'Alwar Plot Boundary Project',
        location: 'Alwar, Rajasthan',
        image: `${process.env.NEXT_PUBLIC_IMAGES}/Alwar.webp`,
    },
];

export default function OurWorkAccordion() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-20" id="our-work">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* SECTION TITLE */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                        Our Work
                    </h2>
                    <p className="text-slate-600 mt-2 text-sm sm:text-base">
                        Explore our featured precast compound wall and paving installations across North India.
                    </p>
                </AnimatedSection>

                {/* ACCORDION CONTAINER */}
                <div className="flex flex-col lg:flex-row gap-4 h-[600px] lg:h-[480px] w-full">
                    {projects.map((project, idx) => {
                        const isActive = activeIndex === idx;

                        return (
                            <motion.div
                                key={idx}
                                layout
                                onClick={() => setActiveIndex(idx)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                initial={false}
                                animate={{
                                    flex: isActive ? 3.5 : 1,
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 25,
                                }}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer border border-slate-200/80 shadow-md transition-shadow duration-300 ${isActive ? 'shadow-2xl ring-2 ring-slate-900/10' : 'hover:shadow-lg'
                                    }`}
                            >
                                {/* BACKGROUND IMAGE */}
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    priority={idx === 0}
                                    className={`object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-105' : 'scale-100 grayscale-[25%]'
                                        }`}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />

                                {/* OVERLAY GRADIENT */}
                                <div
                                    className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t ${isActive
                                        ? 'from-slate-950/85 via-slate-950/30 to-transparent opacity-100'
                                        : 'from-slate-950/70 via-slate-950/20 to-transparent opacity-70'
                                        }`}
                                />

                                {/* CONTENT LAYER */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 select-none">
                                    {/* TOP BADGE / INDEX */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono tracking-widest text-white/70 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            0{idx + 1}
                                        </span>
                                    </div>

                                    {/* BOTTOM CAPTION */}
                                    <div className="overflow-hidden">
                                        <motion.p
                                            layout="position"
                                            className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1"
                                        >
                                            {project.location}
                                        </motion.p>

                                        <motion.h3
                                            layout="position"
                                            className={`font-bold text-white transition-all duration-300 ${isActive ? 'text-lg sm:text-2xl' : 'text-base line-clamp-1'
                                                }`}
                                        >
                                            {project.title}
                                        </motion.h3>

                                        {/* EXPANDED DETAILS (Visible only on active card) */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.25, delay: 0.1 }}
                                                    className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between"
                                                >
                                                    <span className="text-xs text-slate-200">
                                                        Precast Reinforced Concrete Project
                                                    </span>
                                                    <span className="text-xs font-medium text-white flex items-center gap-1 group">
                                                        View Details
                                                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                                                            →
                                                        </span>
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}