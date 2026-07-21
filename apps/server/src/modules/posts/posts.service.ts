import { eq, desc, sql, and, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { posts, categories, votes } from '../../db/schema/index.js';
import {
  REDIS_KEYS,
  safeRedisGet,
  safeRedisSetEx,
  safeRedisDel,
  safeRedisKeys,
} from '../../redis/index.js';
import {
  sanitizeToPlainText,
  validateAndExtractHttpsLinks,
  hashContent,
} from '../../utils/sanitizer.js';
import { calculateTrendingScore } from '../../utils/trendingScore.js';
import { sseService } from '../sse/sse.service.js';
import { CreatePostInput, PostQueryParams, SearchQueryParams } from '@shodasha/shared';

export class PostsService {
  public async listPosts(params: PostQueryParams, voterHash: string) {
    const { sort, category, page, limit } = params;
    const offset = (page - 1) * limit;

    const cacheKey = REDIS_KEYS.homepageFeed(sort, category || 'all', page);
    if (page === 1) {
      const cached = await safeRedisGet(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const enrichedItems = await this.attachUserVotes(parsed.items, voterHash);
        return { ...parsed, items: enrichedItems };
      }
    }

    let categoryId: string | undefined;
    if (category) {
      const [foundCat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);
      if (foundCat) categoryId = foundCat.id;
    }

    const whereClause = and(
      eq(posts.status, 'active'),
      categoryId ? eq(posts.categoryId, categoryId) : undefined
    );

    let orderByClause;
    if (sort === 'latest') {
      orderByClause = desc(posts.createdAt);
    } else if (sort === 'top') {
      orderByClause = desc(posts.upvotes);
    } else {
      orderByClause = desc(posts.trendingScore);
    }

    const [items, countResults] = await Promise.all([
      db
        .select({
          id: posts.id,
          title: posts.title,
          body: posts.body,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          postType: posts.postType,
          upvotes: posts.upvotes,
          downvotes: posts.downvotes,
          commentCount: posts.commentCount,
          trendingScore: posts.trendingScore,
          reportCount: posts.reportCount,
          links: posts.links,
          status: posts.status,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(whereClause),
    ]);

    const count = countResults[0]?.count || 0;
    const totalPages = Math.ceil(count / limit);

    const formattedItems = items.map((p) => ({
      ...p,
      netVotes: p.upvotes - p.downvotes,
      links: (p.links as string[]) || [],
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    const result = {
      items: formattedItems,
      page,
      limit,
      total: count,
      totalPages,
    };

    if (page === 1) {
      await safeRedisSetEx(cacheKey, 60, JSON.stringify(result));
    }

    const finalItems = await this.attachUserVotes(formattedItems, voterHash);
    return { ...result, items: finalItems };
  }

  public async getPostById(id: string, voterHash: string) {
    const cacheKey = REDIS_KEYS.hotPost(id);
    let post: any = null;

    const cached = await safeRedisGet(cacheKey);
    if (cached) {
      post = JSON.parse(cached);
    } else {
      const [dbPost] = await db
        .select({
          id: posts.id,
          title: posts.title,
          body: posts.body,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          postType: posts.postType,
          upvotes: posts.upvotes,
          downvotes: posts.downvotes,
          commentCount: posts.commentCount,
          trendingScore: posts.trendingScore,
          reportCount: posts.reportCount,
          links: posts.links,
          status: posts.status,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(and(eq(posts.id, id), eq(posts.status, 'active')))
        .limit(1);

      if (dbPost) {
        post = {
          ...dbPost,
          netVotes: dbPost.upvotes - dbPost.downvotes,
          links: (dbPost.links as string[]) || [],
          createdAt: dbPost.createdAt.toISOString(),
          updatedAt: dbPost.updatedAt.toISOString(),
        };
        // Cache post data for 5 minutes
        await safeRedisSetEx(cacheKey, 300, JSON.stringify(post));
      }
    }

    if (!post) return null;

    const [voted] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.postId, id), eq(votes.voterHash, voterHash)))
      .limit(1);

    return {
      ...post,
      userVote: voted ? voted.voteValue : 0,
    };
  }

  public async createPost(input: CreatePostInput, _fingerprint: string) {
    if (input.website_url && input.website_url.trim().length > 0) {
      return { id: 'honeypotted', title: input.title };
    }

    const dupHash = hashContent(`${input.title}:${input.body}`);
    const dupKey = REDIS_KEYS.contentHash(dupHash);
    const isDuplicate = await safeRedisGet(dupKey);
    if (isDuplicate) {
      const err = new Error('Duplicate post submission detected. Please do not re-post identical updates.');
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    const cleanTitle = sanitizeToPlainText(input.title);
    const cleanBody = sanitizeToPlainText(input.body);

    const linkResult = validateAndExtractHttpsLinks(input.body);
    if (!linkResult.valid) {
      const err = new Error(linkResult.error || 'Invalid links in post body');
      (err as unknown as { statusCode: number }).statusCode = 400;
      throw err;
    }

    const [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, input.categorySlug))
      .limit(1);

    if (!cat) {
      const err = new Error(`Category '${input.categorySlug}' not found`);
      (err as unknown as { statusCode: number }).statusCode = 400;
      throw err;
    }

    const now = new Date();
    const initialScore = calculateTrendingScore(0, 0, 0, now);

    const [newPost] = await db
      .insert(posts)
      .values({
        title: cleanTitle,
        body: cleanBody,
        categoryId: cat.id,
        postType: input.postType || 'discussion',
        links: linkResult.links,
        trendingScore: initialScore,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!newPost) {
      throw new Error('Failed to create post');
    }

    await safeRedisSetEx(dupKey, 1800, '1');

    await safeRedisDel(REDIS_KEYS.hotPost(newPost.id));

    const keys = await safeRedisKeys('cache:feed:*');
    if (keys.length > 0) {
      await safeRedisDel(...keys);
    }

    sseService.broadcast({
      type: 'post_created',
      postId: newPost.id,
      title: newPost.title,
      upvotes: newPost.upvotes,
      downvotes: newPost.downvotes,
      commentCount: newPost.commentCount,
      trendingScore: newPost.trendingScore,
      createdAt: newPost.createdAt.toISOString(),
    });

    return {
      ...newPost,
      categoryName: cat.name,
      categorySlug: cat.slug,
      netVotes: 0,
      userVote: 0,
      createdAt: newPost.createdAt.toISOString(),
      updatedAt: newPost.updatedAt.toISOString(),
    };
  }

  public async searchPosts(params: SearchQueryParams) {
    const { q, page, limit } = params;
    const offset = (page - 1) * limit;

    const searchVector = sql`to_tsvector('english', ${posts.title} || ' ' || ${posts.body})`;
    const searchQuery = sql`websearch_to_tsquery('english', ${q})`;

    const whereClause = and(
      eq(posts.status, 'active'),
      sql`${searchVector} @@ ${searchQuery}`
    );

    const [items, countResults] = await Promise.all([
      db
        .select({
          id: posts.id,
          title: posts.title,
          body: posts.body,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          postType: posts.postType,
          upvotes: posts.upvotes,
          downvotes: posts.downvotes,
          commentCount: posts.commentCount,
          trendingScore: posts.trendingScore,
          reportCount: posts.reportCount,
          links: posts.links,
          status: posts.status,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(whereClause)
        .orderBy(desc(sql`ts_rank(${searchVector}, ${searchQuery})`))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(whereClause),
    ]);

    const count = countResults[0]?.count || 0;
    const totalPages = Math.ceil(count / limit);

    return {
      items: items.map((p) => ({
        ...p,
        netVotes: p.upvotes - p.downvotes,
        links: (p.links as string[]) || [],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      page,
      limit,
      total: count,
      totalPages,
    };
  }

  private async attachUserVotes(items: Array<Record<string, unknown>>, voterHash: string) {
    if (!items.length) return items;
    const postIds = items.map((i) => i.id as string);

    const userVotes = await db
      .select()
      .from(votes)
      .where(and(eq(votes.voterHash, voterHash), inArray(votes.postId, postIds)));

    const voteMap = new Map(userVotes.map((v) => [v.postId, v.voteValue]));

    return items.map((item) => ({
      ...item,
      userVote: voteMap.get(item.id as string) || 0,
    }));
  }
}

export const postsService = new PostsService();
