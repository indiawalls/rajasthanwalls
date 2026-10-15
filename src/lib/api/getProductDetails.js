import dbConnect from '@/lib/dbConnect.js';
import ProductDetail from '@/models/ProductDetail.mjs';

export async function getProductDetail(slug) {
    if (typeof slug !== 'string') return null;
    await dbConnect();
    const doc = await ProductDetail.findOne({ productSlug: slug.toLowerCase() }).lean();
    if (!doc) return null;
    // Drop Mongo internals and Date objects so the result is plain, serialisable data
    const { _id, __v, createdAt, updatedAt, ...rest } = doc;
    return rest;
}

// Accepts public-folder paths, storage paths, full URLs, or bare filenames stored in NEXT_PUBLIC_IMAGES.
export function assetSrc(path) {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;

    const encodedPath = (path.startsWith('/') ? path : `/${path}`).replace(/ /g, '%20');
    if (encodedPath.startsWith('/images/')) return encodedPath;

    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGES?.replace(/\/+$/, '');
    return imageBaseUrl ? `${imageBaseUrl}${encodedPath}` : encodedPath;
}