import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import dbConnect from '@/lib/dbConnect';
import AuthSecurityTracker from '@/models/AuthSecurityTracker.mjs';
import { sendPasswordResetEmail } from '@/lib/email';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_FAILED_ATTEMPTS = 5;

export async function POST(request) {
    try {
        let body;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
        }

        let rawEmail = typeof body?.email === 'string' ? body.email.trim() : '';
        let rawPassword = typeof body?.password === 'string' ? body.password : '';

        if (rawEmail.length > 254 || rawPassword.length > 128) {
            return NextResponse.json({ error: 'Input length exceeds limit.' }, { status: 400 });
        }

        const email = rawEmail.toLowerCase();
        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
        }

        if (!rawPassword) {
            return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
        }

        // Verify required environment variables
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
            console.error('[AUTH_CONFIG_ERROR] SUPABASE_URL or SUPABASE_ANON_KEY is not defined in environment');
            return NextResponse.json(
                { error: 'Server configuration error: SUPABASE_URL or SUPABASE_ANON_KEY missing in .env.local' },
                { status: 500 }
            );
        }

        // 1. Connect DB and check security lockout tracker
        let tracker = null;
        try {
            await dbConnect();
            tracker = await AuthSecurityTracker.findOne({ identifier: email });
        } catch (dbErr) {
            console.error('[AUTH_DB_ERROR] Failed to reach MongoDB:', dbErr);
            return NextResponse.json(
                { error: `Database connection error: ${dbErr.message || 'Unable to connect to database'}` },
                { status: 503 }
            );
        }

        if (tracker?.isPasswordLocked) {
            // If the emergency reset token has expired, generate and dispatch a fresh one
            if (tracker.passwordResetExpires && new Date() > tracker.passwordResetExpires) {
                const resetToken = crypto.randomBytes(32).toString('hex');
                tracker.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                tracker.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
                await tracker.save();

                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
                const resetUrl = `${siteUrl}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
                console.warn(`[SECURITY ALERT] Reset token expired. Fresh reset URL generated: ${resetUrl}`);

                sendPasswordResetEmail({
                    toEmail: email,
                    resetUrl,
                }).catch((e) => console.error('Failed to resend lockout reset email:', e));

                return NextResponse.json(
                    {
                        error: 'Account is locked. A fresh password reset link has been sent to your email.',
                        locked: true,
                        resetDispatched: true,
                    },
                    { status: 423 }
                );
            }

            return NextResponse.json(
                {
                    error: 'Account is locked due to 5 consecutive failed attempts. Your previous password has been invalidated. Please use the reset link sent to the admin email.',
                    locked: true,
                },
                { status: 423 }
            );
        }

        // 2. Initialize response & Supabase client
        let response = NextResponse.json({ ok: true });
        const { supabase, getResponse } = createSupabaseServerClient({ request, response });

        // 3. Attempt Authentication
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: rawPassword,
        });

        if (error || !data?.user) {
            console.warn('[AUTH_FAILED]', email, error?.message || 'User not found');

            // Record failed attempt
            if (!tracker) {
                tracker = new AuthSecurityTracker({ identifier: email });
            }

            tracker.passwordFailures = (tracker.passwordFailures || 0) + 1;
            tracker.lastFailedAt = new Date();

            if (tracker.passwordFailures >= MAX_FAILED_ATTEMPTS) {
                tracker.isPasswordLocked = true;
                // Generate emergency password reset token (15-min TTL)
                const resetToken = crypto.randomBytes(32).toString('hex');
                tracker.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
                tracker.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
                await tracker.save();

                // Invalidate current password via Supabase Admin SDK by wiping it to a secure unguessable random string
                try {
                    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
                    const targetUser = usersData?.users?.find(u => u.email?.toLowerCase() === email);
                    if (targetUser) {
                        const randomizedPassword = crypto.randomBytes(24).toString('base64') + '!Z9';
                        await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
                            password: randomizedPassword,
                        });
                    }
                } catch (adminErr) {
                    console.error('Failed to randomize password on lockout:', adminErr);
                }

                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
                const resetUrl = `${siteUrl}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
                console.warn(`[SECURITY ALERT] 5 failed password attempts for ${email}. Account locked. Reset URL: ${resetUrl}`);

                // Dispatch emergency recovery link via Resend
                sendPasswordResetEmail({
                    toEmail: email,
                    resetUrl,
                }).catch((e) => console.error('Failed to send lockout reset email:', e));

                return NextResponse.json(
                    {
                        error: 'Account locked due to 5 failed attempts. Old password has been invalidated for security. An emergency reset link has been generated.',
                        locked: true,
                        resetDispatched: true,
                    },
                    { status: 423 }
                );
            }

            await tracker.save();
            const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - tracker.passwordFailures);

            return NextResponse.json(
                {
                    error: `Invalid email or password. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before lockout)`,
                    remainingAttempts,
                },
                { status: 401 }
            );
        }

        // 4. Login Successful: Reset password failure counter
        if (tracker && tracker.passwordFailures > 0) {
            tracker.passwordFailures = 0;
            tracker.isPasswordLocked = false;
            tracker.passwordResetToken = null;
            tracker.passwordResetExpires = null;
            await tracker.save();
        }

        // 5. MFA Stage Verification
        const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        let nextStep = 'done';
        if (aalError) {
            console.error('[AUTH_MFA_ERROR]', aalError);
            return NextResponse.json({ error: 'Internal server error occurred during MFA check.' }, { status: 500 });
        }
        if (aal?.nextLevel === 'aal1') {
            nextStep = 'mfa-setup';
        } else if (aal?.nextLevel === 'aal2') {
            nextStep = 'mfa';
        }

        return getResponse(NextResponse.json({ ok: true, nextStep }));
    } catch (routeErr) {
        console.error('[AUTH_ROUTE_UNHANDLED_ERROR]', routeErr);
        return NextResponse.json(
            { error: routeErr.message || 'An unexpected error occurred during login.' },
            { status: 500 }
        );
    }
}