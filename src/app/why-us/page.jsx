import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
    title: 'Why Choose Us | Rajasthan Wall Infratech - Precast & Fencing Leader',
    description:
        'Discover why developers, industrial parks, and government bodies trust Indiawalls Infratech for high-tensile precast boundary walls, RCC fencing poles, and paver blocks.',
};

const keyDifferentiators = [
    {
        icon: '🏭',
        title: 'In-House Automated Manufacturing',
        desc: 'Equipped with state-of-the-art hydraulic pressing and vibration casting technology to deliver uniform M-30/M-40 concrete strength across every batch.',
    },
    {
        icon: '⚡',
        title: '5x Faster Installation',
        desc: 'Our precast modular wall systems eliminate traditional brick-and-mortar curing delays, allowing up to 300 running feet of wall installation per day.',
    },
    {
        icon: '🛡️',
        title: 'Pre-Stressed Carbon Steel Core',
        desc: 'Reinforced with high-tensile carbon steel strands, our RCC products offer superior flexural strength against soil movements, winds, and impacts.',
    },
    {
        icon: '🌧️',
        title: '100% Saltpeter & Weather Proof',
        desc: 'Dense concrete mix matrices resist groundwater moisture, subterranean termites, and saltpeter (shora) breakdown for a 30+ year service life.',
    },
    {
        icon: '💰',
        title: 'Direct Factory Pricing',
        desc: 'By cutting out middlemen and distributors, we supply directly from our plant to your project site, reducing boundary costs by up to 40%.',
    },
    {
        icon: '🚚',
        title: 'Pan-India Logistics & Execution',
        desc: 'Dedicated transport fleet and expert installation crews capable of handling large-scale industrial, solar plant, and highway projects nationwide.',
    },
];

const impactStats = [
    { value: '15+', label: 'Years of Experience' },
    { value: '500+', label: 'Projects Completed' },
    { value: '2.5M+', label: 'Running Feet Installed' },
    { value: '100%', label: 'Factory Tested Quality' },
];

const ComparisonTable = () => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-slate-900 text-white">
                        <th className="py-4 px-6 font-semibold">Feature / Parameter</th>
                        <th className="py-4 px-6 font-semibold text-yellow-400">Rajasthan Wall Precast Solutions</th>
                        <th className="py-4 px-6 font-semibold text-slate-400">Traditional Brick Boundary Wall</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="py-4 px-6 font-medium text-slate-800">Construction Time</td>
                        <td className="py-4 px-6 font-semibold text-yellow-600 bg-yellow-50/50">Rapid (Up to 300 ft/day)</td>
                        <td className="py-4 px-6 text-slate-500">Slow (20-30 ft/day + curing)</td>
                    </tr>
                    <tr>
                        <td className="py-4 px-6 font-medium text-slate-800">Overall Project Cost</td>
                        <td className="py-4 px-6 font-semibold text-yellow-600 bg-yellow-50/50">30% to 40% Lower Cost</td>
                        <td className="py-4 px-6 text-slate-500">High material & labor overheads</td>
                    </tr>
                    <tr>
                        <td className="py-4 px-6 font-medium text-slate-800">Weather & Soil Resistance</td>
                        <td className="py-4 px-6 font-semibold text-yellow-600 bg-yellow-50/50">Immune to Shora & Dampness</td>
                        <td className="py-4 px-6 text-slate-500">Prone to dampness, cracks, & peeling</td>
                    </tr>
                    <tr>
                        <td className="py-4 px-6 font-medium text-slate-800">Reusability / Relocation</td>
                        <td className="py-4 px-6 font-semibold text-yellow-600 bg-yellow-50/50">100% Relocatable & Reusable</td>
                        <td className="py-4 px-6 text-slate-500">Permanent destruction on site change</td>
                    </tr>
                    <tr>
                        <td className="py-4 px-6 font-medium text-slate-800">Maintenance Required</td>
                        <td className="py-4 px-6 font-semibold text-yellow-600 bg-yellow-50/50">Zero Maintenance</td>
                        <td className="py-4 px-6 text-slate-500">Frequent plaster & paint maintenance</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default function WhyUsPage() {
    return (
        <div className="min-h-screen precast-white-pattern text-slate-800">
            <Navbar />
            {/* 1. Hero Header */}
            <section className="bg-slate-900 text-white pt-8 pb-14 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-2">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                        Uncompromising Excellence
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        Why Rajasthan Wall?
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                        We are redefining boundary infrastructure across India by blending advanced precast engineering, high-tensile steel reinforcement, and direct-from-factory cost efficiency.
                    </p>
                </div>
            </section>

            {/* 2. Impact Stats Bar */}
            <section className="relative -mt-10 px-4 max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 p-8 text-center">
                    {impactStats.map((stat, idx) => (
                        <div key={idx} className="border-r last:border-r-0 border-slate-100">
                            <div className="text-3xl sm:text-4xl font-extrabold text-yellow-600 mb-1">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Core Advantages Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">Engineered for Strength & Durability</h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        How our specialized precast manufacturing gives your project a decisive edge in cost, safety, and speed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {keyDifferentiators.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between hover:border-yellow-500 hover:-translate-y-1"
                        >
                            <div>
                                <div className="text-3xl mb-4 p-3 bg-yellow-50 rounded-xl w-fit">{item.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Comparison Section */}
            <section className="bg-slate-100 py-20 px-4 border-y border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                            Side-by-Side Analysis
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">Precast Wall vs Traditional Brick Wall</h2>
                        <p className="text-slate-600 text-sm sm:text-base">
                            See why modern developers and infrastructure teams are switching away from traditional masonry walls.
                        </p>
                    </div>

                    <ComparisonTable />
                </div>
            </section>

            {/* 5. Production Quality & Commitment */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-widest bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                            Quality Assurance
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold mt-4 mb-6 leading-tight">
                            Rigorous Standard Concrete Testing
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                            Every panel, post, and paver block manufactured at our facility undergoes strict compressive strength testing, water absorption checks, and dimensional tolerance inspections.
                        </p>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <span className="text-yellow-400 font-bold">✓</span> M-30 to M-40 High-Grade Concrete Mix
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-yellow-400 font-bold">✓</span> High-Tensile 3mm - 4mm Steel Reinforcement Strands
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-yellow-400 font-bold">✓</span> IS Standard Compliant Casting Practices
                            </li>
                        </ul>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl h-80 sm:h-96">
                        <img
                            src={`${process.env.NEXT_PUBLIC_IMAGES}/quality%20control%20(1).webp`}
                            alt="Indiawalls Factory Quality Inspection"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* 6. Call to Action Banner */}
            <section className="bg-yellow-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">Ready to Secure Your Boundary?</h2>
                    <p className="text-yellow-100 text-sm sm:text-base mb-8">
                        Get site recommendations, free layout estimates, and direct factory pricing within 24 hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl shadow-xl transition duration-200 text-sm sm:text-base"
                        >
                            Contact Sales Team
                        </Link>
                        <a
                            href="tel:9950711475"
                            className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-8 py-4 rounded-xl shadow-xl transition duration-200 text-sm sm:text-base flex items-center gap-2"
                        >
                            Call +91 9950711475
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}