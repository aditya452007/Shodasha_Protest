import sanitizeHtml from 'sanitize-html';
import crypto from 'node:crypto';
import { POST_LIMITS } from '@shodasha/shared';
const FORBIDDEN_PATTERNS = [
    /<[^>]*>/, // Any HTML tag
    /javascript:/i,
    /data:/i,
    /blob:/i,
    /vbscript:/i,
    /ftp:/i,
    /file:/i,
    /onload=/i,
    /onerror=/i,
    /<script/i,
    /<iframe/i,
    /<svg/i,
    /<style/i,
];
const HTTPS_URL_REGEX = /(https:\/\/[^\s<]+)/gi;
const ANY_URL_REGEX = /([a-zA-Z0-9+.-]+:\/\/[^\s<]+)/gi;
export function isStrictPlainText(text) {
    for (const pattern of FORBIDDEN_PATTERNS) {
        if (pattern.test(text)) {
            return false;
        }
    }
    return true;
}
export function sanitizeToPlainText(text) {
    // Strip all HTML tags completely
    const stripped = sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
    });
    return stripped.trim();
}
export function validateAndExtractHttpsLinks(bodyText) {
    const allUrls = bodyText.match(ANY_URL_REGEX) || [];
    // Check if any non-HTTPS link exists
    for (const url of allUrls) {
        if (!url.toLowerCase().startsWith('https://')) {
            return {
                valid: false,
                links: [],
                error: `Insecure or non-HTTPS URL detected (${url}). Only https:// links are permitted.`,
            };
        }
    }
    const httpsLinks = bodyText.match(HTTPS_URL_REGEX) || [];
    if (httpsLinks.length > POST_LIMITS.MAX_HTTPS_LINKS) {
        return {
            valid: false,
            links: [],
            error: `Exceeded maximum link limit. Allowed: ${POST_LIMITS.MAX_HTTPS_LINKS}, Found: ${httpsLinks.length}`,
        };
    }
    return {
        valid: true,
        links: Array.from(new Set(httpsLinks)), // Deduplicate
    };
}
export function hashContent(content) {
    const normalized = content.toLowerCase().replace(/\s+/g, '');
    return crypto.createHash('sha256').update(normalized).digest('hex');
}
//# sourceMappingURL=sanitizer.js.map