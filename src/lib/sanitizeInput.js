/**
 * NoSQL Injection & Input Sanitization Helper
 * Recursively cleans incoming payloads to prevent MongoDB operator injection ($gt, $ne, etc.)
 */

export function sanitizeNoSql(input) {
    if (input === null || input === undefined) {
        return input;
    }

    if (typeof input !== 'object') {
        // Primitives are safe
        return input;
    }

    if (Array.isArray(input)) {
        return input.map(sanitizeNoSql);
    }

    const clean = {};
    for (const key of Object.keys(input)) {
        // Strip MongoDB operator prefixes ($) and dotted path traversal keys
        if (key.startsWith('$') || key.includes('.')) {
            console.warn(`[SECURITY WARNING] Stripped potentially dangerous NoSQL operator key: "${key}"`);
            continue;
        }
        clean[key] = sanitizeNoSql(input[key]);
    }

    return clean;
}
