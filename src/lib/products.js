import  dbConnect  from '@/lib/dbConnect';
import Product from '@/models/Product.mjs';

const FIELDS = 'title slug badge description longDescription image specs order';

// Convert Mongo's _id to a plain string id so the result is safe to use anywhere
const toPlain = ({ _id, ...rest }) => ({ id: String(_id), ...rest });

export async function getProducts() {
    await dbConnect();
    const docs = await Product.find({ published: true }).sort({ order: 1 }).select(FIELDS).lean();
    return docs.map(toPlain);
}

export async function getProductBySlug(slug) {
    if (typeof slug !== 'string') return null;
    await dbConnect();
    const doc = await Product.findOne({ slug: slug.toLowerCase(), published: true }).select(FIELDS).lean();
    return doc ? toPlain(doc) : null;
}

export const imageSrc = (image) => `${process.env.NEXT_PUBLIC_IMAGES}/${image}`;