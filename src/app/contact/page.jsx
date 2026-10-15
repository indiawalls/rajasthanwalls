import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactInquiryForm from '@/components/ContactInquiryForm';
import { getSiteSettings, fallbackContactInfo } from '@/lib/api/getSiteSettings';

export const metadata = {
    title: 'Contact Us | Rajasthan Wall Infratech - Get Free Site Estimate',
    description:
        'Get in touch with Indiawalls Infratech for factory quotes on precast boundary walls, RCC fencing poles, chainlink mesh, and paver blocks. Call +91 9950711475.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPage() {
    const contactSettings = (await getSiteSettings('contact_info')) || fallbackContactInfo;
    const businessHours = (await getSiteSettings('business_hours')) || {
        weekdays: '9:00 AM – 7:00 PM',
        sunday: 'Site Visits by Appointment',
    };

    const phoneDisplay = contactSettings.phone || fallbackContactInfo.phone;
    const phoneClean = phoneDisplay.replace(/\s+/g, '');
    const whatsappDisplay = contactSettings.whatsapp || fallbackContactInfo.whatsapp;
    const whatsappClean = whatsappDisplay.replace(/\D/g, '');
    const emailDisplay = contactSettings.email || fallbackContactInfo.email;
    const plantDisplay = contactSettings.plantAddress || fallbackContactInfo.plantAddress;
    const officeDisplay = contactSettings.headOffice || fallbackContactInfo.headOffice;
    const mapEmbedUrl = contactSettings.googleMapsEmbed || fallbackContactInfo.googleMapsEmbed;

    const contactDetails = [
        {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Phone & Direct Call',
            value: phoneDisplay,
            href: `tel:${phoneClean}`,
            actionText: 'Call Immediately',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
            ),
            title: 'WhatsApp Inquiry',
            value: whatsappDisplay,
            href: `https://wa.me/${whatsappClean}?text=Hi%20Rajasthan%20Wall,%20I%20want%20to%20get%20a%20quote%20for%20my%20boundary%20project.`,
            actionText: 'Chat on WhatsApp',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email Sales Desk',
            value: emailDisplay,
            href: `mailto:${emailDisplay}`,
            actionText: 'Send Email',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Factory Plant',
            value: plantDisplay,
            href: '#map-section',
            actionText: 'View Location',
        },
        {
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Corporate Office',
            value: officeDisplay,
            href: '#map-section',
            actionText: 'View Location',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            {/* 1. Header Section */}
            <section className="bg-slate-900 text-white pt-8 pb-14 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-2">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                        Get Direct Factory Rates
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        Contact Rajasthan Wall Infratech
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                        Need a site survey, custom product dimensions, or direct factory pricing for your project? Connect with our technical team today.
                    </p>
                </div>
            </section>

            {/* 2. Quick Contact Cards */}
            <section className="relative -mt-10 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {contactDetails.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg flex flex-col justify-between hover:border-yellow-500 transition duration-200"
                        >
                            <div>
                                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
                                    {item.icon}
                                </div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-slate-900 font-bold text-sm mb-3 break-words">
                                    {item.value}
                                </p>
                            </div>
                            <a
                                href={item.href}
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-yellow-600 hover:text-yellow-700 transition"
                            >
                                <span>{item.actionText}</span>
                                <span>→</span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Main Inquiry Form & Business Info Grid */}
            <section className="py-12 sm:py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Contact Form (7 cols) */}
                <div className="lg:col-span-7 bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Request Project Quote
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm">
                            Fill in your requirements below to receive a detailed cost estimate within 24 hours.
                        </p>
                    </div>

                    <ContactInquiryForm />
                </div>

                {/* Business Hours & Direct Info (5 cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-yellow-400">Business & Dispatch Hours</h3>
                        <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
                            Our technical consultants and dispatch teams operate during the following business hours:
                        </p>

                        <ul className="space-y-3 text-xs sm:text-sm border-t border-slate-800 pt-4">
                            <li className="flex justify-between text-slate-300">
                                <span className="font-semibold text-slate-400">Monday – Saturday:</span>
                                <span className="font-bold text-white">{businessHours.weekdays}</span>
                            </li>
                            <li className="flex justify-between text-slate-300">
                                <span className="font-semibold text-slate-400">Sunday:</span>
                                <span className="font-bold text-yellow-400">{businessHours.sunday}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-6 sm:p-8 rounded-3xl">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Urgent Project Requirement?</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                            For urgent bulk dispatches or immediate site inspections across Rajasthan, Delhi NCR, and Haryana, call our technical sales desk directly.
                        </p>
                        <a
                            href={`tel:${phoneClean}`}
                            className="inline-flex items-center justify-center gap-2 bg-yellow-600 text-white font-bold px-4 py-2.5 sm:py-3 rounded-xl hover:bg-yellow-500 transition text-xs sm:text-sm w-full text-center shadow-md whitespace-nowrap"
                        >
                            📞 Call: {phoneDisplay}
                        </a>
                    </div>
                </div>
            </section>

            {/* 4. Map Section */}
            <section id="map-section" className="py-12 px-4 max-w-7xl mx-auto">
                <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
                    <iframe
                        src={mapEmbedUrl}
                        allowFullScreen=""
                        loading="lazy"
                        height="100%"
                        width="100%"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="border-0"
                        title="Rajasthan Wall Google Maps Location"
                    ></iframe>
                </div>
            </section>

            <Footer />
        </div>
    );
}