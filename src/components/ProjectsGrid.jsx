'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MapPin, Images, X, ArrowRight } from 'lucide-react';

export default function ProjectsGrid({ projects }) {
    const [category, setCategory] = useState('All');
    const [openProject, setOpenProject] = useState(null);
    const dialogRef = useRef(null);

    const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], [projects]);
    const visible = category === 'All' ? projects : projects.filter((p) => p.category === category);

    const openGallery = (project) => {
        setOpenProject(project);
        dialogRef.current?.showModal();
    };

    return (
        <>
            {categories.length > 2 && (
                <div role="group" aria-label="Filter projects by category" className="mb-10 flex flex-wrap justify-center gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCategory(c)}
                            aria-pressed={category === c}
                            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${category === c
                                    ? 'border-slate-900 bg-slate-900 text-yellow-300'
                                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-900'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            )}

            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((p) => {
                    const hasGallery = p.gallery?.length > 0;
                    return (
                        <li
                            key={p.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/60 motion-reduce:translate-y-0 motion-reduce:transition-none"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="block h-full w-full object-cover"
                                />
                                {/* fades the photo into the dark card body */}
                                <div
                                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900 to-transparent"
                                    aria-hidden="true"
                                />
                                <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900 shadow-md">
                                    {p.category}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <h2 className="text-xl font-bold leading-snug text-white">{p.title}</h2>
                                <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-400">
                                    <MapPin size={16} className="shrink-0 text-yellow-400" aria-hidden="true" />
                                    {p.location}
                                </p>
                                {p.description && (
                                    <p className="mt-4 text-base leading-relaxed text-slate-300">{p.description}</p>
                                )}
                                {p.slug && (
                                    <Link
                                        href={`/projects/${p.slug}`}
                                        className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-yellow-300 transition hover:text-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
                                    >
                                        View details
                                        <ArrowRight size={16} aria-hidden="true" />
                                    </Link>
                                )}

                                {(hasGallery || p.productSlug) && (
                                    <div className="mt-auto pt-6">
                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-800 pt-5">
                                            {hasGallery && (
                                                <button
                                                    type="button"
                                                    onClick={() => openGallery(p)}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-yellow-400/70 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                                                >
                                                    <Images size={16} aria-hidden="true" />
                                                    View {p.gallery.length} {p.gallery.length === 1 ? 'photo' : 'photos'}
                                                </button>
                                            )}
                                            {p.productSlug && (
                                                <Link
                                                    href={`/products/${p.productSlug}`}
                                                    className="text-sm font-semibold text-slate-300 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                                                >
                                                    About this product
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Gallery dialog: native <dialog> gives Esc-to-close and focus handling for free */}
            <dialog
                ref={dialogRef}
                onClose={() => setOpenProject(null)}
                onClick={(e) => {
                    if (e.target === dialogRef.current) dialogRef.current.close(); // click on the backdrop
                }}
                aria-label={openProject ? `${openProject.title} photos` : 'Project photos'}
                className="m-auto max-h-[90vh] w-[min(94vw,80rem)] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-0 text-white shadow-2xl backdrop:bg-slate-950/80"
            >
                {openProject && (
                    <div className="p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{openProject.title}</h3>
                                <p className="text-sm text-slate-400">{openProject.location}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => dialogRef.current?.close()}
                                aria-label="Close gallery"
                                className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                            >
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {openProject.gallery.map((g) => (
                                <li key={g.src} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                                    <img
                                        src={g.src}
                                        alt={g.alt || openProject.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="aspect-[4/3] max-h-56 w-full object-cover"
                                    />
                                    {g.caption && <p className="p-3 text-sm text-slate-300">{g.caption}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </dialog>
        </>
    );
}
