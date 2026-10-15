// app/api/chat/route.js
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeNoSql } from '@/lib/sanitizeInput';

export async function POST(req) {
    // 1. Sliding-window IP rate limit (max 15 queries per minute)
    const rateLimit = checkRateLimit(req, {
        prefix: 'chat_query',
        limit: 15,
        windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return Response.json(
            { error: 'You are sending messages too quickly. Please wait a moment before trying again.' },
            {
                status: 429,
                headers: { 'Retry-After': String(rateLimit.resetInSeconds) },
            }
        );
    }

    let body;
    try {
        const raw = await req.json();
        body = sanitizeNoSql(raw);
    } catch {
        return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { query, session_id } = body || {};

    // Validate inputs
    if (!query || typeof query !== "string" || query.trim().length === 0 || query.length > 2000) {
        return Response.json({ error: "Invalid or empty query. Must be under 2000 characters." }, { status: 400 });
    }

    const safeSessionId = typeof session_id === "string" && /^[a-zA-Z0-9_-]{1,64}$/.test(session_id)
        ? session_id
        : "default_web_session";

    const primaryUrl = process.env.RAG_API_URL ? `${process.env.RAG_API_URL.replace(/\/$/, '')}/api/query` : null;
    const fallbackUrl = process.env.RAG_API_FALLBACK_URL ? `${process.env.RAG_API_FALLBACK_URL.replace(/\/$/, '')}/api/query` : null;

    const urlsToTry = [primaryUrl, fallbackUrl].filter(Boolean);

    for (const targetUrl of urlsToTry) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

            const res = await fetch(targetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, session_id: safeSessionId }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                return Response.json({ answer: data.answer || "Thank you for reaching out. A representative from Rajasthanwall Infratech will assist you shortly." });
            }
        } catch (err) {
            console.warn(`RAG request failed on ${targetUrl}:`, err.message);
            // Continue to fallback if available
        }
    }

    return Response.json({
        answer: "Our automated engineering assistant is currently offline for maintenance. Please call us directly at +91 99507 11475 for instant project quotes and assistance."
    });
}