import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function verifyAdminSession(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            authorized: false,
            errorResponse: NextResponse.json({ error: 'Authentication is required.' }, { status: 401 }),
        };
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    if (!adminEmail) {
        console.error('[SECURITY ERROR] ADMIN_EMAIL environment variable is not defined.');
        return {
            authorized: false,
            errorResponse: NextResponse.json({ error: 'Server configuration error.' }, { status: 500 }),
        };
    }

    const isAdmin = user.email?.toLowerCase() === adminEmail || user.user_metadata?.role === 'admin';

    if (!isAdmin) {
        return {
            authorized: false,
            errorResponse: NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 }),
        };
    }

    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== 'aal2') {
        return {
            authorized: false,
            errorResponse: NextResponse.json({ error: 'Two-factor MFA authentication is required.' }, { status: 403 }),
        };
    }

    return {
        authorized: true,
        user,
        supabase,
        getResponse,
    };
}
