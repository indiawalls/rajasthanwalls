import Link from 'next/link';
import Image from 'next/image'
const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/indiawallsofficial/',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/facebook.webp`,
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/indiawallsofficial/',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/instagram.webp`,
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/company/indiawalls',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/linkedin.png`,
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/channel/UCKtbPe4q1zKgwNjKLMLK-RQ',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/youtube.webp`,
    },
    {
        name: 'WhatsApp',
        href: 'https://wa.me/917820879777',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/whatsapp.png`,
    },
];

const productLinks = [
    { name: 'Precast RCC Boundary Wall', href: '/products/boundary-walls' },
    { name: 'Redimate Compound Wall', href: '/products/boundary-walls' },
    { name: 'Interlocking Paver Blocks', href: '/products/paver-solutions' },
    { name: 'Barbed Wire Fencing Poles', href: '/products/fencing-solutions' },
    { name: 'Landscaping & Designer Panels', href: '/products/landscaping' },
];

const quickLinks = [
    { name: 'About Us', href: '/#about' },
    { name: 'Why Choose Us', href: '/#why-us' },
    { name: 'Our Work', href: '/projects' },
    { name: 'Manufacturing Units', href: '/#locations' },
    { name: 'FAQs', href: '/#faq' },
    { name: 'Blog & Insights', href: '/blog' },
];

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* COLUMN 1: BRAND & ABOUT (4 COLS) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link
                            href="/"
                            className="inline-block text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl"
                        >
                            Rajasthan<span className="text-yellow-400">Wall.com</span>
                        </Link>

                        <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                            Rajasthan Wall Infratech Private Limited is a leading manufacturer of high-strength precast RCC boundary walls, folding compound walls, and interlocking paver blocks serving industrial and commercial sites across Rajasthan and Delhi NCR.
                        </p>

                        {/* SOCIAL MEDIA LINKS */}
                        <div className="pt-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                                Connect With Us
                            </p>
                            <div className="flex space-x-3">
                                {socialLinks.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.name}
                                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center text-sm transition-all duration-200"
                                    >
                                        <Image
                                            src={item.icon}
                                            alt={`${item.name} Logo`}
                                            width={24}
                                            height={24}
                                            className="object-contain filter group-hover:brightness-110 transition-all"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: QUICK LINKS (2 COLS) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Company
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-amber-400 transition">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMN 3: PRODUCTS (3 COLS) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Products & Services
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {productLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-amber-400 transition">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMN 4: HEAD OFFICE CONTACT (3 COLS) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Head Office
                        </h3>
                        <div className="space-y-3 text-xs sm:text-sm">
                            <p className="flex items-start space-x-3">
                                <span className="text-amber-500">📍</span>
                                <span>C-7 Shri Hari Laxmi Tower, Bhagat Singh Circle, Alwar</span>
                            </p>
                            <p className="flex items-center space-x-3">
                                <span className="text-amber-500">📞</span>
                                <a href="tel:+919950711475" className="hover:text-amber-400 transition">
                                    +91 9950711475
                                </a>
                            </p>
                            <p className="flex items-center space-x-3">
                                <span className="text-amber-500">✉️</span>
                                <a href="mailto:info@rajasthanwall.com" className="hover:text-amber-400 transition">
                                    info@rajasthanwall.com
                                </a>
                            </p>
                        </div>
                    </div>

                </div>

                {/* BOTTOM COPYRIGHT STRIP */}
                <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-200 space-y-4 sm:space-y-0">
                    <p>© {new Date().getFullYear()} Rajasthan Wall Infratech Private Limited. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="#privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
                        <Link href="#terms" className="hover:text-slate-400 transition">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}