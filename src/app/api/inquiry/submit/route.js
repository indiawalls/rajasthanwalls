import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry.mjs';
import { sendInquiryAlert } from '@/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeNoSql } from '@/lib/sanitizeInput';

export async function POST(request) {
    // 1. Sliding-window IP rate limit (max 5 submissions per 10 minutes)
    const rateLimit = checkRateLimit(request, {
        prefix: 'inquiry_submit',
        limit: 5,
        windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Too many submissions. Please call us directly or try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': String(rateLimit.resetInSeconds) },
            }
        );
    }

    let body;
    try {
        const rawBody = await request.json();
        body = sanitizeNoSql(rawBody);
    } catch {
        return NextResponse.json({ error: 'Invalid form payload' }, { status: 400 });
    }

    const { name, phone, product, dimensions, location, requirements, website_hp } = body || {};

    // 2. Honeypot Bot Trap: If website_hp is filled, silently discard without saving or emailing
    if (website_hp && typeof website_hp === 'string' && website_hp.trim().length > 0) {
        console.warn(`[SPAM BOT BLOCKED] Honeypot field was filled by automated bot: "${website_hp.slice(0, 30)}"`);
        return NextResponse.json({
            success: true,
            message: 'Thank you! Your inquiry has been received. Our engineering desk will connect with you within 24 hours.',
        }, { status: 201 });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
        return NextResponse.json({ error: 'Valid phone number is required.' }, { status: 400 });
    }

    try {
        await dbConnect();
        const inquiry = await Inquiry.create({
            name: name.trim().slice(0, 100),
            phone: phone.trim().slice(0, 25),
            product: typeof product === 'string' ? product.trim().slice(0, 100) : '',
            dimensions: typeof dimensions === 'string' ? dimensions.trim().slice(0, 200) : '',
            location: typeof location === 'string' ? location.trim().slice(0, 200) : '',
            requirements: typeof requirements === 'string' ? requirements.trim().slice(0, 1000) : '',
        });

        console.log(`[NEW INQUIRY RECEIVED] From: ${inquiry.name} (${inquiry.phone}) for ${inquiry.product || 'General'}`);

        // Dispatch Resend email notification to Admin
        sendInquiryAlert({
            name: inquiry.name,
            phone: inquiry.phone,
            location: inquiry.location,
            message: `Product: ${inquiry.product || 'N/A'}\nDimensions: ${inquiry.dimensions || 'N/A'}\nRequirements: ${inquiry.requirements || 'N/A'}`,
        }).catch((e) => console.error('Background inquiry email dispatch error:', e));

        return NextResponse.json({
            success: true,
            message: 'Thank you! Your inquiry has been received. Our engineering desk will connect with you within 24 hours.',
            id: inquiry._id,
        }, { status: 201 });
    } catch (err) {
        console.error('Failed to save inquiry:', err);
        return NextResponse.json({ error: 'Could not record inquiry. Please call us directly.' }, { status: 500 });
    }
}
