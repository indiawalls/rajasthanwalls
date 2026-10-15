// Long-form content for one product page (hero, benefits, options, specs, process, gallery, 3D viewer key).
// Lives in its own collection so the products list query stays small.
// Linked to the Product collection by `productSlug`.
import mongoose from 'mongoose';

const { Schema } = mongoose;

// `src` can be '/images/..' (public folder), a full https URL, or a bare filename inside NEXT_PUBLIC_IMAGES.
const ImageSchema = new Schema(
    {
        src: { type: String, required: true, trim: true },
        alt: { type: String, trim: true, default: '' },
        caption: { type: String, trim: true },
    },
    { _id: false }
);

const BenefitSchema = new Schema(
    {
        icon: { type: String, trim: true }, // key mapped to an icon in code: 'zap' | 'shield' | 'coins' | 'ruler'
        title: { type: String, required: true, trim: true },
        text: { type: String, required: true, trim: true },
    },
    { _id: false }
);

// Product options / variants (e.g. GI vs PVC-coated mesh)
const VariantSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        spec: { type: String, trim: true }, // short spec chip, e.g. a wire gauge
        badge: { type: String, trim: true },
        description: { type: String, required: true, trim: true },
        bestFor: { type: String, trim: true },
    },
    { _id: false }
);

const SpecSchema = new Schema(
    {
        feature: { type: String, required: true, trim: true },
        detail: { type: String, required: true, trim: true },
    },
    { _id: false }
);

const ProcessStepSchema = new Schema(
    {
        step: { type: String, trim: true }, // '01'; the page numbers automatically if omitted
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: { type: String, trim: true }, // optional photo for this step
    },
    { _id: false }
);

// Installation steps: description and image are optional (without a description the page shows compact numbered cards)
const InstallStepSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        image: { type: String, trim: true }, // optional photo for this step
    },
    { _id: false }
);

const ProductDetailSchema = new Schema(
    {
        productSlug: {
            type: String,
            required: true,
            unique: true, // one detail document per product
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens'],
        },

        seoTitle: { type: String, trim: true },
        seoDescription: { type: String, trim: true },

        hero: {
            eyebrow: { type: String, trim: true },
            title: { type: String, trim: true },
            intro: { type: String, trim: true },
            image: { type: ImageSchema },
            captions: { type: [String], default: [] }, // short highlight chips over the hero image
            ctaLabel: { type: String, trim: true }, // label of the main hero button
        },

        gallery: { type: [ImageSchema], default: [] }, // any number of extra photos

        benefitsTitle: { type: String, trim: true },
        benefitsIntro: { type: String, trim: true },
        benefits: { type: [BenefitSchema], default: [] },

        variantsTitle: { type: String, trim: true },
        variantsIntro: { type: String, trim: true },
        variants: { type: [VariantSchema], default: [] },

        specsTitle: { type: String, trim: true, default: 'Technical Specifications' },
        technicalSpecs: { type: [SpecSchema], default: [] },

        processTitle: { type: String, trim: true },
        manufacturingSteps: { type: [ProcessStepSchema], default: [] },

        installationTitle: { type: String, trim: true },
        installationSteps: { type: [InstallStepSchema], default: [] }, // numbered automatically on the page

        // Closing call-to-action block
        cta: {
            title: { type: String, trim: true },
            text: { type: String, trim: true },
        },
    },
    { timestamps: true }
);

export default mongoose.models.ProductDetail || mongoose.model('ProductDetail', ProductDetailSchema);
