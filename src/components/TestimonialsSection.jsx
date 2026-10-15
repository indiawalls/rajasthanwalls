import AnimatedSection from './AnimatedSection';
import { getTestimonials } from '@/lib/api/getTestimonials';

export default async function TestimonialsSection() {
    const testimonials = await getTestimonials();

    return (
        <section className="py-20 border-y border-slate-200" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                        Client Feedback
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-base">
                        Feedback from site developers, landowners, and contractors who trust our precast concrete boundary solutions.
                    </p>
                </AnimatedSection>

                {/* TESTIMONIALS GRID */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <AnimatedSection
                            key={idx}
                            delay={0.15 + idx * 0.08}
                            className="bg-white/90 border border-slate-200 rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="space-y-6">
                                {/* Rating Stars */}
                                <div className="flex space-x-1 text-amber-500 text-sm">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-800 text-lg sm:text-xl leading-8 italic">
                                    "{item.quote}"
                                </p>
                            </div>

                            {/* Author Details */}
                            <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-600 leading-6">
                                        {item.role}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                    {item.location}
                                </span>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
}