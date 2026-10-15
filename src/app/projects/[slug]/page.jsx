import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getProjectBySlug } from '@/lib/api/getProjects';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return { title: 'Project not found | Indiawalls Infratech' };
    }

    return {
        title: `${project.title} | Indiawalls Infratech`,
        description: project.description,
    };
}

export default async function ProjectDetailsPage({ params }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) notFound();

    // Main image is no longer shown; only the gallery photos are listed.
    const images = project.gallery.map((image, index) => ({
        ...image,
        alt: image.alt || `${project.title} photo ${index + 1}`,
    }));

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Header: light, text-only */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-white px-4 pb-14 pt-10 sm:pb-16">
                <div
                    className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow-100 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-slate-100 blur-3xl"
                    aria-hidden="true"
                />
                <div className="relative mx-auto max-w-4xl">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to projects
                    </Link>

                    {project.category && (
                        <span className="mt-6 block w-fit rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                            {project.category}
                        </span>
                    )}
                    <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 text-balance sm:text-4xl lg:text-5xl">
                        {project.title}
                    </h1>
                    <div className="mt-5 h-1.5 w-16 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                        <MapPin size={16} className="shrink-0 text-yellow-600" aria-hidden="true" />
                        {project.location}
                    </p>
                    {project.description && (
                        <p className="mt-7 whitespace-pre-line border-l-4 border-yellow-400 pl-5 text-lg leading-relaxed text-slate-600 sm:text-xl sm:leading-9">
                            {project.description}
                        </p>
                    )}
                    {project.longDescription && (
                        <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-600 sm:text-lg">
                            {project.longDescription}
                        </p>
                    )}
                </div>
            </section>

            {/* Gallery */}
            {images.length > 0 && (
                <section className="px-4 py-16" id="gallery">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto mb-10 max-w-2xl text-center">
                            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">More Project Images</h2>
                            <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                        </div>
                        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {images.map((image, index) => (
                                <li
                                    key={`${image.src}-${index}`}
                                    className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none"
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                        />
                                    </div>
                                    {image.caption && (
                                        <p className="border-t border-slate-100 p-4 text-sm font-medium text-slate-700">
                                            {image.caption}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </main>
    );
}
