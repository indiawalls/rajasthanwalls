import dbConnect from '@/lib/dbConnect.js';
import Project from '@/models/Project.mjs';
import { assetSrc } from '@/lib/api/getProductDetails.js';

const FIELDS = 'title slug category productSlug location description longDescription image gallery';

function toProjectData({ _id, image, gallery = [], ...rest }) {
    return {
        id: String(_id),
        ...rest,
        image: assetSrc(image),
        gallery: gallery.map((item) => ({ ...item, src: assetSrc(item.src) })),
    };
}

export async function getProjects() {
    await dbConnect();
    const docs = await Project.find({ published: true }).sort({ order: 1 }).select(FIELDS).lean();

    return docs.map(toProjectData);
}

export async function getProjectBySlug(slug) {
    if (typeof slug !== 'string' || !slug) return null;

    await dbConnect();
    const doc = await Project.findOne({ slug: slug.toLowerCase(), published: true })
        .select(FIELDS)
        .lean();

    return doc ? toProjectData(doc) : null;
}