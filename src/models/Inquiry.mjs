import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    product: { type: String, trim: true, default: '' },
    dimensions: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    requirements: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['new', 'in-review', 'contacted', 'closed'], default: 'new' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
