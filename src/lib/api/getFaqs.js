import dbConnect from '@/lib/dbConnect';
import Faq from '@/models/Faq.mjs';

export const fallbackFaqs = [
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

export async function getFaqs() {
    try {
        await dbConnect();
        const docs = await Faq.find({ published: { $ne: false } })
            .sort({ order: 1, createdAt: -1 })
            .lean();
        if (docs && docs.length > 0) {
            return docs.map((f) => ({
                id: f._id.toString(),
                question: f.question,
                answer: f.answer,
            }));
        }
    } catch (e) {
        console.error('Failed to get FAQs from DB, using fallback:', e.message);
    }
    return fallbackFaqs;
}
