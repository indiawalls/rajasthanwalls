import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProjectsGrid from '@/components/ProjectsGrid';
import { getProjects } from '@/lib/api/getProjects';

export const revalidate = 3600;
export const metadata = {
    title: 'Project Gallery & Completed Works | Rajasthanwall Infratech',
    description:
        'Explore our portfolio of completed precast boundary walls, RCC fencing poles, chainlink fencing, and paver block installations across industrial, commercial, and residential sites.',
};

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Navbar />

            {/* Header */}
            <section className="border-b-2 border-yellow-400 bg-slate-900 px-4 py-8 sm:py-12 text-white">
                <div className="mx-auto max-w-3xl text-center space-y-2.5">
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">Completed Project Gallery</h1>
                    <div className="mx-auto h-1 w-10 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto max-w-lg text-xs sm:text-sm leading-relaxed text-slate-300">
                        Take a look at our recent on-site installations across industrial sites, commercial complexes,
                        farmland boundaries, and infrastructure projects.
                    </p>
                </div>
            </section>

            {/* Projects: a light, plain background so the dark cards stand out */}
            <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                {projects.length > 0 ? (
                    <ProjectsGrid projects={projects} />
                ) : (
                    <p className="py-16 text-center text-lg text-slate-600">
                        Projects are being updated. Please check back soon, or{' '}
                        <Link href="/contact" className="font-semibold underline">
                            contact us
                        </Link>
                        .
                    </p>
                )}
            </section>

            {/* Call to action */}
            <section className="bg-slate-900 px-4 py-16 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-extrabold sm:text-3xl">Have a Project in Mind?</h2>
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto mt-5 mb-8 max-w-2xl text-base text-slate-300 text-balance sm:text-lg">
                        Get site-specific recommendations, material estimates, and competitive factory rates for your site
                        boundary.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="rounded-lg bg-yellow-400 px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                        >
                            Get Free Site Estimate
                        </Link>
                        <a
                            href="tel:+919950711475"
                            className="rounded-lg border border-slate-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
                        >
                            Call +91 9950711475
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
