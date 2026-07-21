import { z } from 'zod';
import { POST_LIMITS, COMMENT_LIMITS, REPORT_REASONS, POST_TYPES, } from '../constants/index.js';
// Regex to reject HTML, scripts, iframe, svg, data/blob/js/vbscript URLs
const HTML_SCRIPT_REGEX = /<[^>]*>|javascript:|data:|blob:|vbscript:|ftp:|onload=|onerror=/i;
// Regex to extract URLs
const URL_REGEX = /(https?:\/\/[^\s<]+)/gi;
export const createPostSchema = z.object({
    title: z
        .string()
        .min(POST_LIMITS.TITLE_MIN_LENGTH, `Title must be at least ${POST_LIMITS.TITLE_MIN_LENGTH} characters`)
        .max(POST_LIMITS.TITLE_MAX_LENGTH, `Title cannot exceed ${POST_LIMITS.TITLE_MAX_LENGTH} characters`)
        .refine((val) => !HTML_SCRIPT_REGEX.test(val), {
        message: 'Title contains forbidden HTML or script characters',
    }),
    body: z
        .string()
        .min(POST_LIMITS.BODY_MIN_LENGTH, `Body must be at least ${POST_LIMITS.BODY_MIN_LENGTH} characters`)
        .max(POST_LIMITS.BODY_MAX_LENGTH, `Body cannot exceed ${POST_LIMITS.BODY_MAX_LENGTH} characters`)
        .refine((val) => !HTML_SCRIPT_REGEX.test(val), {
        message: 'Body contains forbidden HTML or script characters',
    })
        .refine((val) => {
        const links = val.match(URL_REGEX) || [];
        // Check count
        if (links.length > POST_LIMITS.MAX_HTTPS_LINKS)
            return false;
        // Check that ALL links start with https://
        return links.every((link) => link.toLowerCase().startsWith('https://'));
    }, {
        message: 'Maximum 3 HTTPS links allowed. HTTP, FTP, or other non-HTTPS schemes are rejected.',
    }),
    categorySlug: z.string().min(1, 'Category is required'),
    postType: z.enum(POST_TYPES).optional().default('discussion'),
    // Honeypot field for bot detection
    website_url: z.string().optional().default(''),
});
export const createCommentSchema = z.object({
    body: z
        .string()
        .min(COMMENT_LIMITS.BODY_MIN_LENGTH, `Comment must be at least ${COMMENT_LIMITS.BODY_MIN_LENGTH} characters`)
        .max(COMMENT_LIMITS.BODY_MAX_LENGTH, `Comment cannot exceed ${COMMENT_LIMITS.BODY_MAX_LENGTH} characters`)
        .refine((val) => !HTML_SCRIPT_REGEX.test(val), {
        message: 'Comment must be plain text with no HTML or scripts',
    }),
    // Honeypot field
    website_url: z.string().optional().default(''),
});
export const voteSchema = z.object({
    voteValue: z.union([z.literal(1), z.literal(-1)]),
});
export const reportSchema = z.object({
    postId: z.string().uuid().optional(),
    commentId: z.string().uuid().optional(),
    reason: z.enum(REPORT_REASONS),
    details: z.string().max(300).optional(),
}).refine((data) => data.postId || data.commentId, {
    message: 'Must specify either a postId or commentId to report',
});
export const postQuerySchema = z.object({
    sort: z.enum(['trending', 'latest', 'top']).default('trending'),
    category: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
export const searchQuerySchema = z.object({
    q: z.string().min(1).max(100),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
//# sourceMappingURL=index.js.map