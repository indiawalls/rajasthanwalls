import { createClient } from '@supabase/supabase-js';

let _instance = null;

function getSupabaseAdmin() {
    if (_instance) return _instance;
    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';
    _instance = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
    return _instance;
}

export const supabaseAdmin = new Proxy({}, {
    get(target, prop) {
        return getSupabaseAdmin()[prop];
    }
});
