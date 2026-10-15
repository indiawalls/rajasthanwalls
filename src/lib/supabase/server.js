import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export function createSupabaseServerClient({ request, response, updateRequestCookies = false }) {
    let currentResponse = response || NextResponse.next({ request });
    const isProduction = process.env.NODE_ENV === 'production';

    const supabase = createServerClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    if (updateRequestCookies) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                        currentResponse = NextResponse.next({ request });
                    }

                    cookiesToSet.forEach(({ name, value, options }) => {
                        const updatedOptions = {
                            ...options,
                            httpOnly: true, // Always protect session tokens from XSS/client JS
                            secure: isProduction,
                            sameSite: 'lax',
                            path: '/',
                            maxAge: options?.maxAge ?? 60 * 60 * 24 * 7 // default 7 days if not set
                        };
                        currentResponse.cookies.set(name, value, updatedOptions);
                    });
                },
            },
        }
    );

    return {
        supabase,
        getResponse: (targetResponse) => {
            if (targetResponse) {
                // Copy all cookies from currentResponse to targetResponse
                currentResponse.cookies.getAll().forEach((c) => {
                    targetResponse.cookies.set(c.name, c.value, c);
                });
                return targetResponse;
            }
            return currentResponse;
        },
    };
}