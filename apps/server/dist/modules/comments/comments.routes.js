import { commentsController } from './comments.controller.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';
export async function commentsRoutes(fastify) {
    fastify.get('/api/v1/posts/:postId/comments', (req, reply) => commentsController.listComments(req, reply));
    fastify.post('/api/v1/posts/:postId/comments', { preHandler: [createRateLimiter('comment')] }, (req, reply) => commentsController.createComment(req, reply));
}
//# sourceMappingURL=comments.routes.js.map