import { FastifyInstance } from 'fastify';
import { postsController } from './posts.controller.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';

export async function postsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/v1/posts', postsController.listPosts.bind(postsController));
  fastify.get('/api/v1/posts/search', postsController.searchPosts.bind(postsController));
  fastify.get('/api/v1/posts/:id', postsController.getPost.bind(postsController));

  fastify.post(
    '/api/v1/posts',
    { preHandler: [createRateLimiter('post')] },
    postsController.createPost.bind(postsController)
  );
}
