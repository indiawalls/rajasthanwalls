import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import dbConnect from '@/lib/dbConnect';
import AuthSecurityTracker from '@/models/AuthSecurityTracker.mjs';
import { sendEmergencyOtpEmail } from '@/lib/email';

export async function POST(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase } = createSupabaseServerClient({ request, response });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    await dbConnect();
    let tracker = await AuthSecurityTracker.findOne({ identifier: user.email.toLowerCase() });
    if (!tracker) {
        tracker = new AuthSecurityTracker({ identifier: user.email.toLowerCase() });
    }

    // Cryptographically secure CSPRNG 6-digit OTP (unpredictable)
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    // One-way cryptographic SHA-256 hash stored in DB (never plaintext)
    tracker.mfaResetOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
    tracker.mfaResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await tracker.save();

    console.warn(`[SECURITY ALERT] MFA Reset OTP generated for ${user.email}: ${otpCode}`);

    // Dispatch via Resend to user's registered admin email
    const emailRes = await sendEmergencyOtpEmail({
        toEmail: user.email,
        otp: otpCode,
    });

    if (!emailRes.success) {
        console.error('Failed to send MFA OTP email:', emailRes.error);
        return NextResponse.json({
            error: 'Could not send verification email. Please check server logs or contact support.',
        }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: `A 6-digit verification code has been dispatched to ${user.email}. Please check your inbox.`,
    });
}
