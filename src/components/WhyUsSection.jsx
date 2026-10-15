import AnimatedCounter from './AnimatedCounter';

const stats = [
    { label: 'Satisfied Clients', value: 2000, suffix: '+' },
    { label: 'Years Experience', value: 11, suffix: '+' },
    { label: 'Manufacturing Units', value: 10, suffix: '' },
    { label: 'Skilled Laborers', value: 150, suffix: '+' },
];

const features = [
    {
        icon: '⚡',
        title: '50% Faster Installation',
        description: 'Pre-cast off-site under strict factory monitoring and assembled on-site in just a few days.',
    },
    {
        icon: '🛡️',
        title: 'High Durability RCC',
        description: 'Reinforced concrete design built to withstand extreme monsoon conditions and hot weather.',
    },
    {
        icon: '💰',
        title: 'Cost Effective',
        description: 'Saves up to 40% overall compared to traditional brickwork and continuous labor management.',
    },
    {
        icon: '🔄',
        title: 'Relocatable Design',
        description: 'Easily uninstalled and moved to a new site if land usage requirements change.',
    },
];

export default function WhyUsSection() {
    return (
        <section className="py-20 border-y border-slate-200" id="why-us">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                        Why Choose Indiawalls
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-6">
                        Engineered for Strength. Delivered with Speed.
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-base">
                        Over a decade of manufacturing excellence across Rajasthan and Delhi NCR.
                    </p>
                </div>

                {/* ANIMATED STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white/90 border border-slate-200 rounded-2xl p-6 text-center hover:border-amber-500/40 transition"
                        >
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 mb-1">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-700">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* FEATURES GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white/90 border border-slate-200 rounded-2xl p-7 space-y-5 hover:bg-white transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold leading-tight text-slate-900">{feature.title}</h3>
                            <p className="text-base sm:text-lg leading-7 text-slate-700">{feature.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}