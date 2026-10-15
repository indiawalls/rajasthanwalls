// Run with:  node --env-file=.env.local scripts/seed-products.mjs
// Safe to re-run: products are upserted by slug, so nothing is duplicated.
import mongoose from 'mongoose';
import Product from '../src/models/Product.mjs';

const products = [
    {
        title: 'Boundary Walls',
        slug: 'boundary-walls',
        image: '/boundary-wall-images/precast-compound-wall-500x500.webp',
        description:
            'Durable precast concrete panels made off-site and assembled quickly, cutting construction time and keeping quality consistent.',
        specs: ['Factory-made panels', 'Fast installation', 'Design flexibility', 'Less on-site labour'],
        badge: 'Boundary Solutions',
        order: 1,
    },
    {
        title: 'Paver Solutions',
        slug: 'paver-solutions',
        image: 'PaverBlock%20Sols.webp',
        description:
            'Sturdy interlocking concrete units for driveways, walkways, and patios. Easy to install and low on maintenance.',
        specs: ['Interlocking', 'Low maintenance', 'Many shapes & colours', 'Driveways & walkways'],
        badge: 'Paving Solutions',
        order: 2,
    },
    {
        title: 'Fencing Solutions',
        slug: 'fencing-solutions',
        image: 'fencing%20pole.webp',
        description:
            'Sturdy vertical poles that hold fencing in place, giving your property security and a clear boundary.',
        specs: ['Durable', 'Easy to install', 'Fits many fencing styles'],
        badge: 'Structural Support',
        order: 3,
    },
    {
        title: 'Chainlink / Concertina Wire',
        slug: 'chainlink-concertina-wire',
        image: 'chainlink%20concreta%20wire.webp',
        description:
            'Woven chainlink mesh for homes, industry, and sports grounds, plus coiled concertina wire for high-security perimeters.',
        specs: ['Chainlink mesh', 'Concertina coil', 'Cost-effective', 'Easy to install'],
        badge: 'Perimeter Security',
        order: 4,
    },
    {
        title: 'Landscaping',
        slug: 'landscaping',
        image: 'jan-canty-KcQuXaHCSPE-unsplash.jpg',
        description:
            'Outdoor finishing that completes your site: paved pathways, garden edging, and green spaces designed to match your boundary.',
        specs: ['Paved pathways', 'Garden edging', 'Matched to your boundary'], // TODO: replace with your real services
        badge: 'Outdoor Spaces',
        order: 5,
    },
];

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-products.mjs');
    process.exit(1);
}

try {
    await mongoose.connect(uri);
    const result = await Product.bulkWrite(
        products.map((p) => ({
            updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true },
        }))
    );
    console.log(`Seeded products: ${result.upsertedCount} created, ${result.modifiedCount} updated.`);
} catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}