import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, trim: true, default: '' },
        quote: { type: String, required: true, trim: true },
        location: { type: String, trim: true, default: '' },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        avatar: { type: String, trim: true, default: '' },
        order: { type: Number, default: 0, index: true },
        published: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

TestimonialSchema.index({ published: 1, order: 1 });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
