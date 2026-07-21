import { eq, asc, sql, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { comments, posts } from '../../db/schema/index.js';
import { REDIS_KEYS, safeRedisGet, safeRedisSetEx, safeRedisDel, safeRedisKeys, } from '../../redis/index.js';
import { sanitizeToPlainText, hashContent } from '../../utils/sanitizer.js';
import { calculateTrendingScore } from '../../utils/trendingScore.js';
import { sseService } from '../sse/sse.service.js';
export class CommentsService {
    async listComments(postId, page = 1, limit = 50) {
        const cacheKey = `cache:comments:${postId}:${page}:${limit}`;
        const cached = await safeRedisGet(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const offset = (page - 1) * limit;
        const [items, countResults] = await Promise.all([
            db
                .select({
                id: comments.id,
                postId: comments.postId,
                body: comments.body,
                reportCount: comments.reportCount,
                status: comments.status,
                createdAt: comments.createdAt,
            })
                .from(comments)
                .where(and(eq(comments.postId, postId), eq(comments.status, 'active')))
                .orderBy(asc(comments.createdAt))
                .limit(limit)
                .offset(offset),
            db
                .select({ count: sql `count(*)::int` })
                .from(comments)
                .where(and(eq(comments.postId, postId), eq(comments.status, 'active'))),
        ]);
        const count = countResults[0]?.count || 0;
        const totalPages = Math.ceil(count / limit);
        const result = {
            items: items.map((c) => ({
                ...c,
                createdAt: c.createdAt.toISOString(),
            })),
            page,
            limit,
            total: count,
            totalPages,
        };
        await safeRedisSetEx(cacheKey, 60, JSON.stringify(result));
        return result;
    }
    async createComment(postId, input, _fingerprint) {
        if (input.website_url && input.website_url.trim().length > 0) {
            return { id: 'honeypotted', body: input.body };
        }
        const dupHash = hashContent(`${postId}:${input.body}`);
        const dupKey = REDIS_KEYS.contentHash(dupHash);
        const isDuplicate = await safeRedisGet(dupKey);
        if (isDuplicate) {
            const err = new Error('Duplicate comment submission detected.');
            err.statusCode = 409;
            throw err;
        }
        const [targetPost] = await db
            .select()
            .from(posts)
            .where(and(eq(posts.id, postId), eq(posts.status, 'active')))
            .limit(1);
        if (!targetPost) {
            const err = new Error('Post not found');
            err.statusCode = 404;
            throw err;
        }
        const cleanBody = sanitizeToPlainText(input.body);
        const now = new Date();
        const newComment = await db.transaction(async (tx) => {
            const [commentRecord] = await tx
                .insert(comments)
                .values({
                postId,
                body: cleanBody,
                createdAt: now,
            })
                .returning();
            if (!commentRecord) {
                throw new Error('Failed to insert comment');
            }
            const updatedCommentCount = targetPost.commentCount + 1;
            const newScore = calculateTrendingScore(targetPost.upvotes, targetPost.downvotes, updatedCommentCount, targetPost.createdAt);
            await tx
                .update(posts)
                .set({
                commentCount: updatedCommentCount,
                trendingScore: newScore,
                updatedAt: now,
            })
                .where(eq(posts.id, postId));
            return commentRecord;
        });
        await safeRedisSetEx(dupKey, 600, '1');
        const keys = await safeRedisKeys('cache:feed:*');
        if (keys.length > 0) {
            await safeRedisDel(...keys);
        }
        // Invalidate post and comments cache
        await safeRedisDel(REDIS_KEYS.hotPost(postId));
        const commentKeys = await safeRedisKeys(`cache:comments:${postId}:*`);
        if (commentKeys.length > 0) {
            await safeRedisDel(...commentKeys);
        }
        sseService.broadcast({
            type: 'comment_added',
            postId,
            commentCount: targetPost.commentCount + 1,
        });
        return {
            ...newComment,
            createdAt: newComment.createdAt.toISOString(),
        };
    }
}
export const commentsService = new CommentsService();
//# sourceMappingURL=comments.service.js.map