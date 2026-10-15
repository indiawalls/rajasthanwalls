import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers, and hyphens'],
        },
        author: { type: String, trim: true, default: 'Rajasthanwall Engineering Desk' },
        category: { type: String, trim: true, default: 'Industry Insights' },
        excerpt: { type: String, trim: true, default: '' },
        content: { type: String, required: true },
        coverImage: { type: String, trim: true, default: '' },
        readTime: { type: String, trim: true, default: '4 min read' },
        published: { type: Boolean, default: true, index: true },
        publishedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

BlogPostSchema.index({ published: 1, publishedAt: -1 });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
