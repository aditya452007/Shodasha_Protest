import { eq, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { posts, votes } from '../../db/schema/index.js';
import { safeRedisDel, safeRedisKeys } from '../../redis/index.js';
import { calculateTrendingScore } from '../../utils/trendingScore.js';
import { sseService } from '../sse/sse.service.js';

export class VotesService {
  public async voteOnPost(postId: string, voteValue: 1 | -1, voterHash: string) {
    const [targetPost] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.status, 'active')))
      .limit(1);

    if (!targetPost) {
      const err = new Error('Post not found');
      (err as unknown as { statusCode: number }).statusCode = 404;
      throw err;
    }

    const result = await db.transaction(async (tx) => {
      const [existingVote] = await tx
        .select()
        .from(votes)
        .where(and(eq(votes.postId, postId), eq(votes.voterHash, voterHash)))
        .limit(1);

      let upvoteDelta = 0;
      let downvoteDelta = 0;
      let currentUserVote: number = 0;

      if (!existingVote) {
        await tx.insert(votes).values({
          postId,
          voterHash,
          voteValue,
        });

        if (voteValue === 1) upvoteDelta = 1;
        else downvoteDelta = 1;

        currentUserVote = voteValue;
      } else if (existingVote.voteValue === voteValue) {
        await tx.delete(votes).where(eq(votes.id, existingVote.id));

        if (voteValue === 1) upvoteDelta = -1;
        else downvoteDelta = -1;

        currentUserVote = 0;
      } else {
        await tx
          .update(votes)
          .set({ voteValue })
          .where(eq(votes.id, existingVote.id));

        if (voteValue === 1) {
          upvoteDelta = 1;
          downvoteDelta = -1;
        } else {
          upvoteDelta = -1;
          downvoteDelta = 1;
        }

        currentUserVote = voteValue;
      }

      const newUpvotes = Math.max(0, targetPost.upvotes + upvoteDelta);
      const newDownvotes = Math.max(0, targetPost.downvotes + downvoteDelta);

      const newTrendingScore = calculateTrendingScore(
        newUpvotes,
        newDownvotes,
        targetPost.commentCount,
        targetPost.createdAt
      );

      await tx
        .update(posts)
        .set({
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          trendingScore: newTrendingScore,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, postId));

      return {
        postId,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        netVotes: newUpvotes - newDownvotes,
        trendingScore: newTrendingScore,
        userVote: currentUserVote,
      };
    });

    const keys = await safeRedisKeys('cache:feed:*');
    if (keys.length > 0) {
      await safeRedisDel(...keys);
    }

    sseService.broadcast({
      type: 'vote_updated',
      postId,
      upvotes: result.upvotes,
      downvotes: result.downvotes,
      trendingScore: result.trendingScore,
    });

    return result;
  }
}

export const votesService = new VotesService();
