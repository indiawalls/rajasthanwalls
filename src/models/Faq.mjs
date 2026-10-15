import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema(
    {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true },
        category: { type: String, trim: true, default: 'General' },
        order: { type: Number, default: 0, index: true },
        published: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

FaqSchema.index({ published: 1, order: 1 });

export default mongoose.models.Faq || mongoose.model('Faq', FaqSchema);
