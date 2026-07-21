import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { commentsController } from './comments.controller.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';

export async function commentsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/posts/:postId/comments', (req: FastifyRequest, reply: FastifyReply) =>
    commentsController.listComments(req as FastifyRequest<{ Params: { postId: string }; Querystring: { page?: number; limit?: number } }>, reply)
  );

  fastify.post(
    '/api/v1/posts/:postId/comments',
    { preHandler: [createRateLimiter('comment')] },
    (req: FastifyRequest, reply: FastifyReply) =>
      commentsController.createComment(req as FastifyRequest<{ Params: { postId: string } }>, reply)
  );
}
