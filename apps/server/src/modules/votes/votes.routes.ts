import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { votesController } from './votes.controller.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';

export async function votesRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/api/v1/posts/:id/vote',
    { preHandler: [createRateLimiter('vote')] },
    (req: FastifyRequest, reply: FastifyReply) =>
      votesController.vote(req as FastifyRequest<{ Params: { id: string } }>, reply)
  );
}
