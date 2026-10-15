import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import dbConnect from '@/lib/dbConnect';
import AuthSecurityTracker from '@/models/AuthSecurityTracker.mjs';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';
    if (!/^\d{6}$/.test(otp)) {
        return NextResponse.json({ error: 'Enter a valid 6-digit OTP.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Lock endpoint: Only users with an active verified factor can reset
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const hasVerifiedFactor = factors?.all?.some((f) => f.status === 'verified');
    if (!hasVerifiedFactor) {
        return NextResponse.json(
            { error: 'No active MFA factor to reset.' },
            { status: 400 }
        );
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({ identifier: user.email.toLowerCase() });

    if (!tracker || !tracker.mfaResetOtp || !tracker.mfaResetOtpExpires) {
        return NextResponse.json({ error: 'No active MFA reset request found.' }, { status: 400 });
    }

    if (new Date() > tracker.mfaResetOtpExpires) {
        return NextResponse.json({ error: 'Reset OTP has expired. Please request a new code.' }, { status: 400 });
    }

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (otpHash !== tracker.mfaResetOtp) {
        return NextResponse.json({ error: 'Incorrect OTP code.' }, { status: 400 });
    }

    // Delete existing TOTP factors via Supabase Admin SDK
    try {
        const { data: factors } = await supabaseAdmin.auth.admin.mfa.listFactors({ userId: user.id });
        for (const f of factors?.factors || []) {
            await supabaseAdmin.auth.admin.mfa.deleteFactor({
                userId: user.id,
                id: f.id,
            });
        }

        // Reset tracker lockout flags
        tracker.mfaFailures = 0;
        tracker.isMfaLocked = false;
        tracker.mfaResetOtp = null;
        tracker.mfaResetOtpExpires = null;
        await tracker.save();

        // Refresh session token so Next.js cookies update to AAL1 enrollment state
        try {
            await supabase.auth.refreshSession();
        } catch {
            // Non-fatal if refresh fails
        }

        const result = NextResponse.json({
            success: true,
            message: 'Authenticator has been removed. Redirecting to setup a fresh QR code...',
            redirectTo: '/mfa/setup',
        });
        return getResponse(result);
    } catch (err) {
        console.error('Failed to reset MFA factor:', err);
        return NextResponse.json({ error: 'Failed to reset MFA factor. Please try again.' }, { status: 500 });
    }
}
