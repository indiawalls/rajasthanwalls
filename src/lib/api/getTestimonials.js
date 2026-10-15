import dbConnect from '@/lib/dbConnect';
import Testimonial from '@/models/Testimonial.mjs';

export const fallbackTestimonials = [
    {
        name: 'Rajesh Sharma',
        role: 'Site Manager, Industrial Park',
        location: 'Bhiwadi',
        rating: 5,
        quote:
            'The precast RCC compound wall installation was fast and seamless. They completed 1,000 running feet in under 5 days, saving us significant labor costs compared to traditional brick masonry.',
    },
    {
        name: 'Vikram Singh',
        role: 'Commercial Plot Owner',
        location: 'Alwar',
        rating: 5,
        quote:
            'Outstanding quality and alignment. The precast panels and posts are very sturdy, and the team ensured precise boundary demarcation without any material wastage on site.',
    },
    {
        name: 'Amit Patel',
        role: 'Civil Infrastructure Contractor',
        location: 'Gurugram',
        rating: 5,
        quote:
            'We sourced both boundary walls and heavy-duty paver blocks for our logistics yard. Prompt delivery from their factory unit and excellent structural finishing.',
    },
];

export async function getTestimonials() {
    try {
        await dbConnect();
        const docs = await Testimonial.find({ published: { $ne: false } })
            .sort({ order: 1, createdAt: -1 })
            .lean();
        if (docs && docs.length > 0) {
            return docs.map((d) => ({
                id: d._id.toString(),
                name: d.name,
                role: d.role,
                location: d.location,
                rating: d.rating || 5,
                quote: d.quote,
            }));
        }
    } catch (e) {
        console.error('Failed to get testimonials from DB, using fallback:', e.message);
    }
    return fallbackTestimonials;
}
