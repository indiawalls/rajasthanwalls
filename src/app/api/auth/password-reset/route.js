import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import dbConnect from '@/lib/dbConnect';
import AuthSecurityTracker from '@/models/AuthSecurityTracker.mjs';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { email, token, newPassword } = body || {};

    if (!email || !token || !newPassword) {
        return NextResponse.json({ error: 'Email, token, and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    await dbConnect();
    const tracker = await AuthSecurityTracker.findOne({ identifier: email.toLowerCase() });

    if (!tracker || !tracker.passwordResetToken || !tracker.passwordResetExpires) {
        return NextResponse.json({ error: 'Invalid or expired password reset request.' }, { status: 400 });
    }

    if (new Date() > tracker.passwordResetExpires) {
        return NextResponse.json({ error: 'Reset token has expired. Please initiate login again to generate a new reset link.' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (tokenHash !== tracker.passwordResetToken) {
        tracker.passwordResetToken = null;
        tracker.passwordResetExpires = null;
        await tracker.save();
        return NextResponse.json({ error: 'Invalid password reset token. Recovery session revoked.' }, { status: 400 });
    }

    // Update password via Supabase Admin SDK
    try {
        const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
        if (listErr) throw listErr;

        const targetUser = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
            password: newPassword,
        });

        if (updateErr) throw updateErr;

        // Clear lockout in tracker
        tracker.passwordFailures = 0;
        tracker.isPasswordLocked = false;
        tracker.passwordResetToken = null;
        tracker.passwordResetExpires = null;
        await tracker.save();

        return NextResponse.json({
            success: true,
            message: 'Password successfully reset! You can now log in with your new password.',
        });
    } catch (err) {
        console.error('Password reset execution failed:', err);
        return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 });
    }
}
