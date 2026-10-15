import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import SiteSetting from '@/models/SiteSetting.mjs';
import { defaultManufacturingUnits } from '@/lib/api/getSiteSettings';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();
        const doc = await SiteSetting.findOne({ key: 'manufacturing_units' }).lean();
        const units = (doc && Array.isArray(doc.value) && doc.value.length > 0)
            ? doc.value
            : defaultManufacturingUnits;

        return auth.getResponse(NextResponse.json({ success: true, units }));
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch manufacturing units' }, { status: 500 });
    }
}

export async function PUT(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        const body = await request.json();
        const { units } = body || {};

        if (!Array.isArray(units)) {
            return NextResponse.json({ error: 'Units must be an array.' }, { status: 400 });
        }

        // Sanitize and validate units
        const sanitized = units.map((u, i) => ({
            city: String(u.city || `Unit ${i + 1}`).trim(),
            region: String(u.region || 'Rajasthan').trim(),
            address: String(u.address || '').trim(),
            lat: parseFloat(u.lat) || 27.5,
            lng: parseFloat(u.lng) || 76.5,
            mapsUrl: String(u.mapsUrl || `https://maps.google.com/?q=${u.lat},${u.lng}`).trim(),
        }));

        await dbConnect();
        const updated = await SiteSetting.findOneAndUpdate(
            { key: 'manufacturing_units' },
            {
                $set: {
                    value: sanitized,
                    description: 'Interactive map manufacturing plant units and coordinates',
                    updatedAt: new Date(),
                },
            },
            { upsert: true, returnDocument: 'after' }
        );

        return auth.getResponse(NextResponse.json({ success: true, units: updated.value }));
    } catch (err) {
        console.error('Failed to save manufacturing units:', err);
        return NextResponse.json({ error: 'Failed to save manufacturing units' }, { status: 500 });
    }
}
