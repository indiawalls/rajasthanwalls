import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request) {
    const initialResponse = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response: initialResponse });

    // Must already be signed in (AAL1)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    // Remove abandoned, unverified factors from earlier attempts
    const { data: factors } = await supabase.auth.mfa.listFactors();
    for (const f of factors?.all ?? []) {
        if (f.factor_type === 'totp' && f.status === 'unverified') {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `Authenticator ${Date.now()}`,
    });

    if (error) {
        return NextResponse.json({ error: 'Could not start enrollment.' }, { status: 400 });
    }

    const result = NextResponse.json({
        ok: true,
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
    });

    return getResponse(result);
}