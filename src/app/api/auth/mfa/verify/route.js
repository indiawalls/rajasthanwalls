import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import dbConnect from '@/lib/dbConnect';
import AuthSecurityTracker from '@/models/AuthSecurityTracker.mjs';

const MAX_MFA_ATTEMPTS = 5;

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ error: 'Enter a valid 6-digit code.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Connect DB and inspect MFA tracker
    await dbConnect();
    let tracker = await AuthSecurityTracker.findOne({ identifier: user.email.toLowerCase() });

    if (tracker?.isMfaLocked) {
        return NextResponse.json(
            {
                error: 'MFA is frozen due to 5 failed attempts. Please use your email OTP to reset your authenticator app.',
                locked: true,
                redirectTo: '/mfa/reset',
            },
            { status: 423 }
        );
    }

    let factorId = typeof body?.factorId === 'string' ? body.factorId : null;
    if (!factorId) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        factorId = factors?.totp?.[0]?.id ?? null;
    }
    if (!factorId) {
        return NextResponse.json({ error: 'No MFA factor found.' }, { status: 400 });
    }

    // Challenge & verify
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });

    if (error) {
        if (!tracker) {
            tracker = new AuthSecurityTracker({ identifier: user.email.toLowerCase() });
        }

        tracker.mfaFailures = (tracker.mfaFailures || 0) + 1;
        tracker.lastFailedAt = new Date();

        if (tracker.mfaFailures >= MAX_MFA_ATTEMPTS) {
            tracker.isMfaLocked = true;
            // Generate emergency 6-digit OTP using cryptographically secure CSPRNG (10 min TTL)
            const otpCode = crypto.randomInt(100000, 1000000).toString();
            // Encrypted via SHA-256 hash in DB (never plaintext)
            tracker.mfaResetOtp = crypto.createHash('sha256').update(otpCode).digest('hex');
            tracker.mfaResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await tracker.save();

            console.warn(`[SECURITY ALERT] 5 failed MFA attempts for ${user.email}. MFA frozen. Emergency Email OTP: ${otpCode}`);

            return NextResponse.json(
                {
                    error: 'MFA frozen due to 5 failed attempts. An emergency reset OTP has been generated.',
                    locked: true,
                    redirectTo: '/mfa/reset',
                },
                { status: 423 }
            );
        }

        await tracker.save();
        const remaining = Math.max(0, MAX_MFA_ATTEMPTS - tracker.mfaFailures);

        return NextResponse.json(
            {
                error: `Invalid code. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before freeze)`,
                remainingAttempts: remaining,
            },
            { status: 401 }
        );
    }

    // Success: Clear MFA failures
    if (tracker && tracker.mfaFailures > 0) {
        tracker.mfaFailures = 0;
        tracker.isMfaLocked = false;
        tracker.mfaResetOtp = null;
        tracker.mfaResetOtpExpires = null;
        await tracker.save();
    }

    return getResponse();
}