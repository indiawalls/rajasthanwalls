import Image from 'next/image';

const clients = [
    { name: 'Tata', logo: 'Tata.webp' },
    { name: 'Adani', logo: 'adani.webp' },
    { name: 'One Group', logo: 'OneGroup.webp' },
    { name: 'Nagar Nigam', logo: 'municipal.webp' },
    { name: 'Indian Railways', logo: 'IndianRailways.webp' },
    { name: 'Humanity Ahead', logo: 'HumanityAhead.webp' },
    { name: 'Nagar Vikas', logo: 'NagarVikas.webp' },
    { name: 'Essel', logo: 'Essel.webp' },
    { name: 'Aviana', logo: 'Aviana.jpg' },
    { name: 'Bhaskar Jyoti', logo: 'Bhaskar%20Jyoti%20(India%20Pvt%20Ltd).png' },
    { name: 'ats', logo: 'ats.png' },
    { name: 'Bharta Construction', logo: 'Bharata%20Construction.png' },
    { name: 'cosine power', logo: 'Cosine%20Power%20Ltd.jpg' },
    { name: 'Modi Groups', logo: 'modi%20groups.jpg' },
    { name: 'DCC Infra', logo: 'dcc_infra.jpg' },
];

// Duplicate array for seamless endless scrolling loop
const doubledClients = [...clients, ...clients];

export default function ClienteleSection() {
    return (
        <section className="py-16 border-y border-slate-200 overflow-hidden" id="clientele">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 text-center">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                    Trusted Partners
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    Our Clients
                </h2>
            </div>

            {/* MARQUEE CONTAINER */}
            <div className="relative w-full overflow-hidden flex items-center">

                {/* Left and Right Blur Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* INFINITE SCROLL TRACK */}
                <div className="flex gap-6 sm:gap-8 items-center animate-marquee whitespace-nowrap w-max">
                    {doubledClients.map((client, idx) => (
                        <div
                            key={idx}
                            className="relative flex w-36 sm:w-48 h-36 sm:h-40 shrink-0 items-center justify-center rounded-2xl bg-slate-100 p-5 sm:p-8 opacity-100 transition-all duration-450"
                        >
                            <div className="relative h-full w-full">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMAGES}/${client.logo}`}
                                    alt={`${client.name} Logo`}
                                    fill
                                    className="object-contain"
                                    sizes="(min-width: 640px) 160px, 112px"
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}