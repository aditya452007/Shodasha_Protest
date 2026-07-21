import { FastifyRequest, FastifyReply } from 'fastify';
import { REDIS_KEYS, safeRedisIncr } from '../redis/index.js';
import { RATE_LIMITS } from '@shodasha/shared';

export function createRateLimiter(action: 'post' | 'comment' | 'report' | 'vote') {
  return async function rateLimitCheck(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const fingerprint = req.fingerprint;
    const key = REDIS_KEYS.rateLimit(fingerprint, action);

    let maxAllowed = 1;
    let windowSeconds = 60;

    if (action === 'post') {
      maxAllowed = 1;
      windowSeconds = RATE_LIMITS.POST_COOLDOWN_SECONDS;
    } else if (action === 'comment') {
      maxAllowed = 1;
      windowSeconds = RATE_LIMITS.COMMENT_COOLDOWN_SECONDS;
    } else if (action === 'report') {
      maxAllowed = RATE_LIMITS.MAX_REPORTS_PER_WINDOW;
      windowSeconds = RATE_LIMITS.REPORT_LIMIT_WINDOW_SECONDS;
    } else if (action === 'vote') {
      maxAllowed = RATE_LIMITS.MAX_VOTES_PER_WINDOW;
      windowSeconds = RATE_LIMITS.VOTE_LIMIT_WINDOW_SECONDS;
    }

    try {
      const count = await safeRedisIncr(key, windowSeconds);

      if (count > maxAllowed) {
        reply.status(429).send({
          success: false,
          data: null,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded for action '${action}'. Please wait ${windowSeconds} seconds before trying again.`,
          },
        });
      }
    } catch (err) {
      req.log.error({ err }, 'Rate limiter error');
    }
  };
}
