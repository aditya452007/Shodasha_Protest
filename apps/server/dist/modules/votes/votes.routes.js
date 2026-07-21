import { votesController } from './votes.controller.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';
export async function votesRoutes(fastify) {
    fastify.post('/api/v1/posts/:id/vote', { preHandler: [createRateLimiter('vote')] }, (req, reply) => votesController.vote(req, reply));
}
//# sourceMappingURL=votes.routes.js.map