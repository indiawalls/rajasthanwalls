import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request) {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    await supabase.auth.signOut();
    return getResponse();
}
