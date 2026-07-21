import { FastifyRequest, FastifyReply } from 'fastify';
export declare function createRateLimiter(action: 'post' | 'comment' | 'report' | 'vote'): (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
//# sourceMappingURL=rateLimiter.d.ts.map