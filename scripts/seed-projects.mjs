// Run with:  node --env-file=.env.local scripts/seed-projects.mjs
// Safe to re-run: projects are upserted by slug, so nothing is duplicated.
import mongoose from 'mongoose';
import Project from '../src/models/Project.mjs';

const projects = [
    {
        title: 'Industrial Factory Boundary Wall',
        slug: 'industrial-factory-boundary-wall',
        category: 'Precast Boundary Walls',
        location: 'Bhiwadi Industrial Zone, Rajasthan',
        image: '/boundary-wall-images/precast-compound-wall-500x500.webp',
        gallery: [], // optional. e.g. { src: '/images/projects/bhiwadi-1.webp', alt: 'Wall during installation' }
        description:
            '1,200 running feet of 8ft high precast concrete boundary wall with heavy reinforcement for long-term perimeter security.',
        order: 1,
    },
    {
        title: 'Solar Power Plant Boundary Fencing',
        slug: 'solar-power-plant-boundary-fencing',
        category: 'Complete Security Walls',
        location: 'Bhadla, Rajasthan',
        image: '/fencing%20pole.webp',
        gallery: [],
        description:
            'Installation of 8ft RCC pre-stressed fencing poles with pre-drilled wire slots across a 15-acre solar farm perimeter.',
        order: 2,
    },
    {
        title: 'High-Density GI Chainlink Perimeter',
        slug: 'high-density-gi-chainlink-perimeter',
        category: 'Complete Security Walls',
        location: 'Gurugram Commercial Hub',
        image: '/chainlink%20concreta%20wire.webp',
        gallery: [],
        description:
            'Heavy-zinc hot-dip galvanized chainlink mesh fence installed on custom steel posts for low wind-resistance and high visibility.',
        order: 3,
    },
    {
        title: 'Heavy Vehicle Interlocking Paver Driveway',
        slug: 'heavy-vehicle-interlocking-paver-driveway',
        category: 'Paver Blocks',
        location: 'Logistics Park, Haryana',
        image: '/PaverBlock%20Sols.webp',
        gallery: [],
        description:
            '80mm zig-zag heavy-duty interlocking paver block installation engineered for heavy freight truck movement and high loads.',
        order: 4,
    },
    {
        title: 'Farmland Agricultural Boundary Wall',
        slug: 'farmland-agricultural-boundary-wall',
        category: 'Precast Boundary Walls',
        location: 'Alwar, Rajasthan',
        image: '/farmland%20agriculture%20boundary.webp',
        gallery: [],
        description:
            'Agriculture boundary wall to protect farmland from trespassers and animals, with precase concrete pannels for long term durability.',
        order: 5,
    },
    {
        title: 'Residential Society Boundary Wall',
        slug: 'residential-society-boundary-wall',
        category: 'Precast Boundary Walls',
        location: 'Noida Extension, UP',
        image: '/residential%20society%20boundary%20wall.webp',
        gallery: [],
        description:
            'Decorative textured precast concrete panels designed for rapid installation with an elegant architectural look.',
        order: 6,
    },
];

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-projects.mjs');
    process.exit(1);
}

try {
    // Validate every project up front so a typo fails here with a clear message, before touching the database
    for (const p of projects) {
        await new Project(p).validate();
    }

    await mongoose.connect(uri);
    const result = await Project.bulkWrite(
        projects.map((p) => ({
            updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true },
        }))
    );
    console.log(`Seeded projects: ${result.upsertedCount} created, ${result.modifiedCount} updated.`);
} catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
