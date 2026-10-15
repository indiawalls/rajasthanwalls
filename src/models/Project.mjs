
import mongoose from 'mongoose';

const { Schema } = mongoose;
const ImageSchema = new Schema(
    {
        src: { type: String, required: true, trim: true },
        alt: { type: String, trim: true, default: '' },
        caption: { type: String, trim: true },
    },
    { _id: false }
);

const ProjectSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: false,
            unique: true, // used for a future /projects/[slug] page and for upserts
            sparse: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
        },

        category: { type: String, required: true, trim: true, index: true }, // label shown on the page, e.g. 'Precast Walls'
        productSlug: { type: String, trim: true, lowercase: true }, // optional link to a product, e.g. 'boundary-walls'

        location: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        longDescription: { type: String, trim: true, default: '' },

        image: { type: String, required: true, trim: true }, // cover image shown on the projects grid
        gallery: { type: [ImageSchema], default: [] }, // optional extra photos for this project

        order: { type: Number, default: 0, index: true }, // controls the sequence on the page
        published: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ProjectSchema.index({ published: 1, order: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
