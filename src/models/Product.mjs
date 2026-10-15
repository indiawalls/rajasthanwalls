// .mjs on purpose: Next.js and the plain-Node seed script can both import this file as-is.
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true, // creates the index used by slug lookups
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
        },
        badge: { type: String, trim: true },
        description: { type: String, required: true, trim: true },
        longDescription: { type: String, trim: true }, // optional; shown on the detail page
        image: { type: String, required: true, trim: true }, // filename inside NEXT_PUBLIC_IMAGES
        specs: { type: [String], default: [] },
        order: { type: Number, default: 0, index: true }, // controls order on the products page
        published: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ProductSchema.index({ published: 1, order: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
