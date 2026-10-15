import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const PRIMARY_HOST = 'rajasthanwall.com';
const REDIRECT_HOSTS = new Set([
    'rajasthanwalls.com',
    'www.rajasthanwalls.com',
    'rajasthanwalls.in',
    'www.rajasthanwalls.in',
    'www.rajasthanwall.com',
]);

export async function middleware(req) {
    const host = (req.headers.get('host') || '').toLowerCase().split(':')[0];
    const pathname = req.nextUrl.pathname;

    // 1. Canonical Domain Redirection (301 Permanent Redirect to rajasthanwall.com)
    if (REDIRECT_HOSTS.has(host)) {
        const destination = new URL(req.url);
        destination.protocol = 'https:';
        destination.host = PRIMARY_HOST;
        destination.port = '';
        return NextResponse.redirect(destination, 301);
    }

    // 2. Multi-Step Admin & MFA State Machine Route Lock
    // Step 0A: Block direct access to /admin/reset-password without emergency token
    if (pathname.startsWith("/admin/reset-password")) {
        const token = req.nextUrl.searchParams.get("token");
        const email = req.nextUrl.searchParams.get("email");
        if (!token || !email || token.trim().length < 16) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    const isOnAdmin = pathname.startsWith("/admin");
    const isMfaRoute = pathname.startsWith("/mfa");

    // Public pages pass through without overhead
    if (!isOnAdmin && !isMfaRoute) {
        return NextResponse.next();
    }

    const { supabase, getResponse } = createSupabaseServerClient({
        request: req,
        response: NextResponse.next({ request: req }),
        updateRequestCookies: true,
    });

    const { data: { user } } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    // STEP 0: NOT LOGGED IN AT ALL
    if (!isLoggedIn) {
        // Can ONLY visit /admin (Login Page) and /admin/reset-password (with signed token)
        const isAllowedPublicAdmin = pathname === "/admin" || (pathname.startsWith("/admin/reset-password") && req.nextUrl.searchParams.get("token"));
        if (isAllowedPublicAdmin) {
            return getResponse();
        }
        // ALL other routes (/admin/dashboard/*, /admin/form-panel, /mfa, /mfa/*) are locked:
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // USER HAS LOGGED IN (Step 1 or Step 2)
    const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) {
        return NextResponse.json({ error: "Could not verify authentication level." }, { status: 500 });
    }

    const isAal2 = assurance?.currentLevel === "aal2";
    const needsEnrollment = assurance?.nextLevel === "aal1"; // Has not setup MFA yet
    const needsVerify = assurance?.currentLevel === "aal1" && assurance?.nextLevel === "aal2"; // Password correct, TOTP pending

    // If user returns to /admin (Login Screen) before completing MFA, sign out the partial session
    // so they are not trapped in an MFA redirect loop
    if (pathname === "/admin" && !isAal2) {
        await supabase.auth.signOut();
        return getResponse();
    }

    // STEP 1A: Password correct, but must setup MFA first
    if (needsEnrollment) {
        if (pathname === "/mfa/setup" || pathname === "/mfa/reset") {
            return getResponse();
        }
        return NextResponse.redirect(new URL("/mfa/setup", req.url));
    }

    // STEP 1B: Password correct, but must verify 2FA TOTP code
    if (needsVerify) {
        // Allowed on /mfa, /mfa/reset (emergency OTP), and /mfa/setup (re-enrollment)
        if (pathname === "/mfa" || pathname === "/mfa/reset" || pathname === "/mfa/setup") {
            return getResponse();
        }
        // Any attempt to skip directly to /admin/dashboard is blocked and bounced back to /mfa
        return NextResponse.redirect(new URL("/mfa", req.url));
    }

    // STEP 2: Fully Verified Admin (AAL2 Session)
    if (isAal2) {
        // If already logged in, visiting login or MFA screen redirects to dashboard
        if (pathname === "/admin" || pathname.startsWith("/mfa") || pathname.startsWith("/admin/reset-password")) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        // Allowed to access /admin/dashboard and all CMS management pages
        return getResponse();
    }

    return getResponse();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images / svg public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};