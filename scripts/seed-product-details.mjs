// Run with:  node --env-file=.env.local scripts/seed-product-details.mjs
// Safe to re-run: documents are upserted by productSlug, so nothing is duplicated.
// Run seed-products.mjs first so each detail has a matching product.
import mongoose from 'mongoose';
import Product from '../src/models/Product.mjs';
import ProductDetail from '../src/models/ProductDetail.mjs';

const details = [
    // ---------------------------------------------------------------- Boundary walls
    {
        productSlug: 'boundary-walls',
        seoTitle: 'Precast Concrete Boundary Walls & RCC Compound Walls | Indiawalls',
        seoDescription:
            'Explore high-strength precast RCC boundary walls, factory-cured concrete panels, and customized fencing solutions for residential, farm, and industrial properties.',

        hero: {
            eyebrow: 'Boundary & Perimeter Solutions',
            title: 'Precast RCC Boundary & Compound Walls',
            intro:
                'Factory-manufactured reinforced concrete wall panels designed for quick assembly, superior durability, and low long-term maintenance across residential plots, farmhouses, and industrial land.',
            image: { src: '/images/precastwalls/precast.webp', alt: 'Precast Concrete Boundary Wall' },
            captions: ['Factory Cured', 'Steel Reinforced', 'Rapid On-Site Setup'],
            ctaLabel: 'Get Quick Quote',
        },

        // TODO: add more photos, e.g. { src: '/images/precastwalls/site-1.webp', alt: 'Installed wall at a farmhouse' }
        gallery: [],

        viewer: { type: 'precast-wall', params: {} },

        benefitsTitle: 'Why Choose Precast Concrete Walls?',
        benefitsIntro:
            'Replacing traditional brick walls with ready-made reinforced concrete structures saves time, reduces total cost, and provides uniform structural stability.',
        benefits: [
            {
                icon: 'zap',
                title: 'Rapid Installation',
                text: 'Installed up to 5x faster than brick masonry. Completed within a few days without waiting for wet curing or on-site brick laying.',
            },
            {
                icon: 'shield',
                title: 'High Durability & Strength',
                text: 'Manufactured with M-30 to M-40 grade RCC. Designed to withstand harsh weather, seismic vibrations, and extreme temperatures.',
            },
            {
                icon: 'coins',
                title: 'Cost Effective & Relocatable',
                text: 'Minimizes labor overhead and material wastage. Can be safely dismantled and relocated if boundary layouts change in the future.',
            },
        ],

        specsTitle: 'Technical Specifications',
        technicalSpecs: [
            { feature: 'Concrete Grade', detail: 'M-30 to M-40 High-Strength RCC' },
            { feature: 'Reinforcement', detail: 'Pre-stressed / High-Tensile Rebar Mesh' },
            { feature: 'Available Heights', detail: '4 ft to 12+ ft (Customizable)' },
            { feature: 'Panel Thickness', detail: '50 mm to 150 mm' },
            { feature: 'Curing Method', detail: 'Factory Steam/Water Cured (7-14 Days)' },
            { feature: 'Durability / Lifespan', detail: '50+ Years (Weather & Fire Resistant)' },
        ],

        processTitle: 'How Precast Walls Are Made',
        manufacturingSteps: [
            {
                step: '01',
                title: 'Design & Engineering',
                description:
                    'Expert architects and engineers collaborate to create precise mold specifications based on project requirements.',
                image: '/images/precastwalls/design engineering.webp',
            },
            {
                step: '02',
                title: 'Mold Preparation & Steel Reinforcement',
                description:
                    'Precision steel molds are set up with high-tensile steel mesh rebar (M-30 to M-40 grade concrete specs).',
                image: '/images/precastwalls/mold preparation.webp',
            },
            {
                step: '03',
                title: 'Concrete Casting & Controlled Curing',
                description:
                    'High-grade concrete mix is poured and cured in a factory-controlled environment for 7 to 14 days.',
                image: '/images/precastwalls/curing.webp',
            },
            {
                step: '04',
                title: 'Quality Check & Delivery',
                description: 'Rigorous dimensional and load tests before safe dispatch to the installation site.',
                image: '/images/precastwalls/quality control.webp',
            },
        ],

        installationTitle: '4-Step On-Site Installation Process',
        installationSteps: [
            { title: 'Site Preparation & Ground Excavation' },
            { title: 'RCC Pole Footing & Alignment' },
            { title: 'Panel Slotting & Positioning' },
            { title: 'Jointing, Sealing & Final Inspection' },
        ],

        cta: {
            title: 'Request an Instant Quote',
            text: 'Send us your site details and boundary dimensions for a customized cost estimate.',
        },
    },


    // ---------------------------------------------------------------- Fencing poles
    {
        productSlug: 'fencing-solutions',
        seoTitle: 'Heavy Duty RCC Concrete & Metal Fencing Poles | Indiawalls',
        seoDescription:
            'High-strength precast RCC concrete fencing poles and galvanized steel posts with pre-drilled holes for farmland, industrial boundaries, and solar power plants.',

        hero: {
            eyebrow: 'Structural Support Systems',
            title: 'Heavy-Duty Concrete & Steel Fencing Poles',
            intro:
                'Pre-stressed RCC concrete poles and steel posts engineered with pre-drilled wire slots for secure, maintenance-free boundary definition across farmland, industrial sites, and solar parks.',
            image: { src: '/fencing-solutions/fencing-solutions.webp', alt: 'Precast Concrete Fencing Poles' },
            captions: ['Pre-Stressed Steel Wire Inside', 'Pre-Drilled Wire Holes'],
            ctaLabel: 'Get Bulk Pricing',
        },

        gallery: [],

        benefitsTitle: 'Why Choose Precast Fencing Poles?',
        benefitsIntro:
            'Long-lasting structural support that outperforms wooden posts and untreated metal pipes against soil moisture, termites, and harsh weather.',
        benefits: [
            {
                icon: 'pin',
                title: 'Pre-Drilled Wire Holes',
                text: 'Equipped with pre-molded hole slots to allow easy stringing of barbed wire, chainlink mesh, or concertina coils without drilling on-site.',
            },
            {
                icon: 'rain',
                title: 'Weather & Soil Resistant',
                text: 'Impervious to saltpeter (shora), subterranean termites, and damp soil conditions, guaranteeing decades of service.',
            },
            {
                icon: 'strength',
                title: 'Pre-Stressed Steel Core',
                text: 'Reinforced internally with high-tensile carbon steel strands for flexural strength against animal impact and high winds.',
            },
        ],

        variantsTitle: 'Available Pole Types',
        variantsIntro: 'Select the right structural support based on your property security requirement.',
        variants: [
            {
                name: 'Precast RCC Concrete Poles',
                spec: '6 ft to 10 ft Height',
                badge: 'Most Popular',
                description:
                    'Manufactured using high-grade RCC with internal pre-stressed steel wire reinforcement. Features pre-drilled holes for quick wire stringing.',
                bestFor: 'Agricultural Land, Solar Plants & Boundary Walls',
            },
            {
                name: 'T-Angle / Y-Angle Steel Posts',
                spec: 'Custom Sizes Available',
                badge: 'High Security',
                description:
                    'Heavy-duty structural steel angles designed for mounting razor wire coils and extension arms over wall perimeters.',
                bestFor: 'High-Security Concertina & Razor Wire Security',
            },
            {
                name: 'GI Pipe & Tubular Poles',
                spec: '2" to 3" Diameter',
                badge: 'Rust Proof',
                description:
                    'Galvanized iron poles engineered to resist rust and humidity, providing a clean aesthetic finish for chainlink mesh panels.',
                bestFor: 'Sports Grounds, Commercial & Residential Lawns',
            },
        ],

        specsTitle: 'Technical Specifications',
        technicalSpecs: [
            { feature: 'Pole Material', detail: 'M-30 Grade RCC / Galvanized Steel' },
            { feature: 'Reinforcement Wire', detail: 'High-Tensile Carbon Steel Wire (3mm - 4mm)' },
            { feature: 'Standard Heights', detail: '6 ft, 7 ft, 8 ft, 9 ft & 10 ft' },
            { feature: 'Wire Holes', detail: '5 to 8 Pre-Drilled Hole Slots' },
            { feature: 'Saltpeter (Shora) Resistance', detail: '100% Weather & Mineral Resistant' },
            { feature: 'Lifespan', detail: '30+ Years Zero Maintenance' },
        ],

        installationTitle: 'Installation Process',
        installationSteps: [
            {
                title: 'Site Marking & Excavation',
                description:
                    'Marking the fence line, fixing corner and line pole positions at even spacing, and digging a pit for each pole.',
            },
            {
                title: 'Material Delivery',
                description:
                    'Transporting RCC poles, steel posts, and stringing wire to the site, with poles unloaded carefully to avoid chipped edges.',
            },
            {
                title: 'Pole Erection & Alignment',
                description:
                    'Setting corner and strainer poles first, then the line poles, checking each is upright and in line with the string guide before the base is grouted with concrete.',
            },
            {
                title: 'Wire Stringing & Tensioning',
                description:
                    'Once the concrete has set, passing barbed wire, chainlink, or concertina through the pre-drilled holes and tensioning it evenly along the run.',
            },
            {
                title: 'Final Inspection',
                description:
                    'Checking that poles are firm and aligned, wire tension is uniform across every span, and the site is cleared before handover.',
            },
        ],

        cta: {
            title: 'Request Pole Quotation',
            text: 'Provide your required pole height and approximate quantity for an instant factory rate quote.',
        },
    },
    // ---------------------------------------------------------------- Paver blocks
    {
        productSlug: 'paver-solutions',
        seoTitle: 'Heavy Duty Interlocking Paver Blocks & Concrete Tiles | Indiawalls',
        seoDescription:
            'High-strength interlocking concrete paver blocks in Zig-Zag, I-Shape, Hexagonal, and Rectangular patterns for driveways, parking spaces, petrol pumps, and industrial yards.',

        hero: {
            eyebrow: 'Paving & Flooring Solutions',
            title: 'High-Strength Interlocking Paver Blocks',
            intro:
                'Factory-pressed heavy-duty concrete paver blocks engineered for extreme vehicular load, all-weather durability, and rapid installation across commercial driveways, petrol pumps, and public walkways.',
            image: { src: '/paver-blocks/emilie-PCEYPtW3vN8-unsplash%20(1).jpg', alt: 'Heavy Duty Interlocking Concrete Paver Blocks' },
            captions: ['Hydraulic Vibration Pressed', 'M-30 to M-50 Grade'],
            ctaLabel: 'Request Price List',
        },

        gallery: [],

        benefitsTitle: 'Why Choose Interlocking Pavers?',
        benefitsIntro:
            'Superior alternative to traditional asphalt and plain concrete flooring with zero curing downtime and instant usability.',
        benefits: [
            {
                icon: 'truck',
                title: 'Heavy Load Bearing',
                text: 'Engineered to handle high point-loads, heavy trucks, container movements, and continuous traffic without cracking.',
            },
            {
                icon: 'wrench',
                title: 'Easy Underground Access',
                text: 'Blocks can be easily lifted for underground pipe/cable repairs and reinstated without leaving messy patches or cuts.',
            },
            {
                icon: 'rain',
                title: 'Anti-Skid & Weather Proof',
                text: 'Textured surface ensures high friction even during heavy rains, reducing accidents in steep driveways and parking ramps.',
            },
        ],

        variantsTitle: 'Available Shapes & Patterns',
        variantsIntro: 'Choose the ideal interlocking profile for your specific traffic requirement.',
        variants: [
            {
                name: 'I-Shape / Dumbbell Paver',
                spec: '60mm - 80mm',
                badge: 'Heavy Duty',
                description:
                    'Provides maximum interlocking mechanical lock. Highly resistant to wheel rotation friction from heavy trucks and buses.',
                bestFor: 'Heavy Traffic, Industrial Yards & Petrol Pumps',
            },
            {
                name: 'Zig-Zag Paver Block',
                spec: '60mm - 80mm',
                badge: 'Popular',
                description:
                    'Classic wave edges provide four-way continuous locking to prevent shifting under continuous vehicular loads.',
                bestFor: 'Highways, Commercial Parking & Port Areas',
            },
            {
                name: 'Hexagonal / Honeycomb Paver',
                spec: '50mm - 60mm',
                badge: 'Aesthetic',
                description:
                    'Aesthetic geometric finish offering multi-directional load distribution and easy replacement during maintenance.',
                bestFor: 'Parks, Walkways & Residential Driveways',
            },
            {
                name: 'Grass Paver Block',
                spec: '60mm - 80mm',
                badge: 'Eco-Friendly',
                description:
                    'Hollow cell concrete design that allows grass growth while enabling rainwater harvesting and soil protection.',
                bestFor: 'Eco-Friendly Parking, Lawns & Landscaping',
            },
        ],

        specsTitle: 'Technical Specifications',
        technicalSpecs: [
            { feature: 'Compressive Strength', detail: 'M-30 to M-50 Grade Concrete' },
            { feature: 'Thickness Range', detail: '50 mm, 60 mm, 80 mm & 100 mm' },
            { feature: 'Manufacturing Process', detail: 'High-Frequency Hydraulic Pressure Compaction' },
            { feature: 'Water Absorption', detail: 'Less than 5% (IS 15658 Compliant)' },
            { feature: 'Abrasion Resistance', detail: 'High Wear-Resistant Upper Layer' },
            { feature: 'Available Colors', detail: 'Grey, Red, Yellow, Black & Customized Shades' },
        ],

        installationTitle: 'Installation Process',
        installationSteps: [
            {
                title: 'Site Preparation',
                description: 'Excavation, ground levelling, and heavy compaction of the base soil to create a stable foundation.',
                image: '/paver-blocks/site%20preparation.webp',
            },
            {
                title: 'Material Delivery',
                description: 'Unloading factory-tested interlocking blocks and aggregates directly at the site location.',
                image: '/paver-blocks/material%20delivery.webp',
            },
            {
                title: 'Positioning',
                description: 'Precise hand-laying of paver blocks according to the specified design pattern and slope alignment.',
                image: '/paver-blocks/positioning.webp',
            },
            {
                title: 'Jointing & Sealing',
                description: 'Spreading fine jointing sand across the blocks followed by plate compactor locking and surface sealing.',
                image: '/paver-blocks/jointing.webp',
            },
            {
                title: 'Final Inspection',
                description: 'Comprehensive structural level check, edge restraint verification, and final cleaning before handoff.',
                image: '/paver-blocks/final%20inspection.webp',
            },
        ],

        cta: {
            title: 'Calculate Your Paver Block Requirement',
            text: 'Submit your area dimensions (in Sq. Ft. or Sq. Meter) for an accurate price estimate per square foot.',
        },
    },
];

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-product-details.mjs');
    process.exit(1);
}

try {
    // Validate every document up front so a typo fails here with a clear message, before touching the database
    for (const d of details) {
        await new ProductDetail(d).validate();
    }

    await mongoose.connect(uri);

    // Warn if a detail has no matching product (its page would never be reachable)
    const slugs = details.map((d) => d.productSlug);
    const found = await Product.find({ slug: { $in: slugs } }).select('slug').lean();
    const missing = slugs.filter((s) => !found.some((p) => p.slug === s));
    if (missing.length) {
        console.warn(`Warning: no product found for: ${missing.join(', ')}. Run seed-products.mjs first.`);
    }

    const result = await ProductDetail.bulkWrite(
        details.map((d) => ({
            updateOne: { filter: { productSlug: d.productSlug }, update: { $set: d }, upsert: true },
        }))
    );
    console.log(`Seeded product details: ${result.upsertedCount} created, ${result.modifiedCount} updated.`);
} catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
