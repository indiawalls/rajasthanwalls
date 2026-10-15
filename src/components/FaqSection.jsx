'use client';

import { useState } from 'react';
import AnimatedSection from './AnimatedSection';

const faqs = [
    {
        question: 'What is a precast RCC boundary wall, and how is it made?',
        answer:
            'A precast RCC (Reinforced Cement Concrete) boundary wall consists of factory-made concrete panels and prestressed posts. Manufactured under strict quality control using high-tensile steel strands and high-grade concrete, these components are transported to your site and assembled using an interlocking slot system.',
    },
    {
        question: 'How fast can a precast boundary wall be installed on-site?',
        answer:
            'On average, our team can install 100 to 200 running feet of precast wall per day depending on ground conditions. This makes installation up to 50% faster than traditional brick-and-mortar masonry walls.',
    },
    {
        question: 'Are precast RCC walls cheaper than traditional brick walls?',
        answer:
            'Yes, precast concrete walls save up to 30% to 40% on total project costs. Savings come from reduced site labor requirements, zero raw material wastage (sand, brick, water), and faster completion times without needing continuous plastering.',
    },
    {
        question: 'How durable are these walls against extreme weather and moisture?',
        answer:
            'Precast RCC panels are highly resistant to heavy monsoon rains, severe summer heat, freeze-thaw cycles, and soil moisture. Because they are cast with high-density concrete, they do not crack, rot, or absorb water like conventional brick walls.',
    },
    {
        question: 'Can precast walls be relocated or dismantled later?',
        answer:
            'Yes! One of the biggest advantages of our modular precast system is that the panels and posts can be safely uninstalled, transported, and re-erected if your land boundaries or site layout plans change in the future.',
    },
    {
        question: 'Which areas do you supply and service?',
        answer:
            'We manufacture and deliver across Rajasthan and Delhi NCR, with major service hubs near our factory units in Alwar, Bhiwadi, Gurugram, Faridabad, and surrounding industrial zones.',
    },
];

export default function FaqSection({ initialFaqs }) {
    const [openIndex, setOpenIndex] = useState(null);
    const displayFaqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : faqs;

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 border-y border-slate-200" id="faq">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                        Got Questions?
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Everything you need to know about precast concrete walls, manufacturing standards, and installation procedures.
                    </p>
                </AnimatedSection>

                {/* ACCORDION LIST */}
                <div className="space-y-4">
                    {displayFaqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <AnimatedSection
                                key={idx}
                                delay={0.15 + idx * 0.06}
                                className="bg-white/90 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
                                >
                                    <span className="text-base sm:text-lg font-bold text-slate-900">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-amber-500 text-white' : ''
                                            }`}
                                    >
                                        ↓
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </AnimatedSection>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}