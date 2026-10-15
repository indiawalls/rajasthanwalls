/**
 * In-Memory Sliding-Window Rate Limiter
 * Zero-dependency, memory-safe rate limiter for Next.js API route handlers.
 */

const ipStore = new Map();

// Periodic garbage collection every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

    lastCleanup = now;
    for (const [key, record] of ipStore.entries()) {
        if (record.resetAt <= now) {
            ipStore.delete(key);
        }
    }
}

/**
 * Extracts the client IP address from the request headers
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }
    return '127.0.0.1';
}

/**
 * Checks if the request exceeds the rate limit
 * @param {Request} request
 * @param {object} options
 * @param {string} options.prefix - Prefix to separate endpoints (e.g. 'inquiry', 'chat')
 * @param {number} options.limit - Max requests allowed in window
 * @param {number} options.windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetInSeconds: number }}
 */
export function checkRateLimit(request, { prefix = 'api', limit = 10, windowMs = 60 * 1000 } = {}) {
    cleanupStaleEntries();

    const ip = getClientIp(request);
    const key = `${prefix}:${ip}`;
    const now = Date.now();

    let record = ipStore.get(key);

    if (!record || record.resetAt <= now) {
        record = {
            count: 1,
            resetAt: now + windowMs,
        };
        ipStore.set(key, record);
        return {
            allowed: true,
            remaining: limit - 1,
            resetInSeconds: Math.ceil(windowMs / 1000),
        };
    }

    record.count += 1;

    if (record.count > limit) {
        const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
        return {
            allowed: false,
            remaining: 0,
            resetInSeconds,
        };
    }

    return {
        allowed: true,
        remaining: limit - record.count,
        resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
}
