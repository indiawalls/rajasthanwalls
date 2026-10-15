'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ClipboardList, Ruler, Factory, Wrench, ShieldCheck } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const processSteps = [
    {
        step: '01',
        title: 'Consultation & Site Assessment',
        description:
            'We start with a detailed consultation to understand your land boundary requirements and assess the site for a customized structural solution.',
        icon: ClipboardList,
        // image: 'ProcessSiteVisit.webp',
    },
    {
        step: '02',
        title: 'Design & Engineering Planning',
        description:
            'Our team plans and designs your boundary wall layout using advanced engineering parameters to ensure precise alignment with your land specifications.',
        icon: Ruler,
    },
    {
        step: '03',
        title: 'Precision Factory Production',
        description:
            'We manufacture the reinforced precast concrete panels and prestressed columns in our high-capacity facilities under strict quality controls.',
        icon: Factory,
    },
    {
        step: '04',
        title: 'Fast On-Site Installation',
        description:
            'Our expert installation team transports the precast components and assembles the compound wall on-site using specialized interlocking techniques.',
        icon: Wrench,
    },
    {
        step: '05',
        title: 'Final Quality Inspection',
        description:
            'We conduct a thorough final inspection to verify structural soundness, panel alignment, and total security standards before handover.',
        icon: ShieldCheck,
    },
];

function useInView() {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSeen(true);
                    io.disconnect();
                }
            },
            { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return [ref, seen];
}

function ProcessRow({ item, index, isLast }) {
    const [ref, seen] = useInView();
    const Icon = item.icon;
    const cardOnLeft = index % 2 === 0;

    // Literal class strings so Tailwind can detect them
    const cardPlacement = cardOnLeft ? 'md:col-start-1' : 'md:col-start-3';
    const fillerPlacement = cardOnLeft ? 'md:col-start-3' : 'md:col-start-1';
    const hiddenShift = cardOnLeft ? 'md:-translate-x-8' : 'md:translate-x-8';

    return (
        <div
            ref={ref}
            className="grid grid-cols-[2.5rem_1fr] md:grid-cols-[1fr_3rem_1fr] gap-x-4 md:gap-x-10"
        >
            {/* Centre rail: step node, drawing line, arrow */}
            <div className="row-start-1 col-start-1 md:col-start-2 flex flex-col items-center">
                <div
                    className={`z-10 flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm md:text-base font-extrabold text-slate-900 ring-4 ring-white transition-transform duration-500 motion-reduce:transition-none ${seen ? 'scale-100' : 'scale-75'
                        }`}
                >
                    {item.step}
                </div>

                {!isLast && (
                    <>
                        <div className="relative w-0.5 flex-1 overflow-hidden bg-slate-200">
                            <div
                                className={`absolute inset-0 origin-top bg-slate-900 transition-transform duration-700 ease-out delay-300 motion-reduce:transition-none ${seen ? 'scale-y-100' : 'scale-y-0'
                                    }`}
                            />
                        </div>
                        <div
                            className={`z-10 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-yellow-400 ring-4 ring-white transition-all duration-500 delay-[900ms] motion-reduce:transition-none ${seen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
                                }`}
                            aria-hidden="true"
                        >
                            <ArrowDown size={16} strokeWidth={3} />
                        </div>
                    </>
                )}
            </div>

            {/* Card */}
            <div
                className={`row-start-1 col-start-2 ${cardPlacement} ${isLast ? '' : 'mb-14'} rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-700 ease-out motion-reduce:transition-none ${seen
                    ? 'translate-x-0 translate-y-0 opacity-100'
                    : `translate-y-6 opacity-0 md:translate-y-0 ${hiddenShift}`
                    }`}
            >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-yellow-400">
                    <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{item.title}</h3>
                <p className="text-base leading-7 text-slate-600">{item.description}</p>
            </div>

            {/* Opposite side: photo if provided, otherwise blank (desktop only) */}
            <div
                className={`row-start-1 hidden md:flex ${fillerPlacement} ${isLast ? '' : 'mb-14'} items-center justify-center`}
                aria-hidden={item.image ? undefined : 'true'}
            >
                {item.image && (
                    <div
                        className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-200 transition-opacity duration-700 delay-300 motion-reduce:transition-none ${seen ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGES}/${item.image}`}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProjectProcess() {
    return (
        <section className="border-y py-20" id="how-it-works">
            <div className="mx-auto max-w-5xl px-4 sm:px-8">
                <AnimatedSection delay={0.05} className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        How We Complete a Full Project
                    </h2>
                    <div className="mx-auto mt-5 h-1.5 w-16 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mt-6 text-base leading-7 text-slate-600 text-balance sm:text-lg">
                        From initial site measurement to final inspection, our streamlined 5-step workflow ensures
                        fast and reliable execution.
                    </p>
                </AnimatedSection>

                <div>
                    {processSteps.map((item, index) => (
                        <ProcessRow
                            key={item.step}
                            item={item}
                            index={index}
                            isLast={index === processSteps.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}