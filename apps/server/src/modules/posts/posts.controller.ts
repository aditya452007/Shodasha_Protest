import { FastifyRequest, FastifyReply } from 'fastify';
import { postsService } from './posts.service.js';
import { postQuerySchema, createPostSchema, searchQuerySchema } from '@shodasha/shared';

export class PostsController {
  public async listPosts(req: FastifyRequest, reply: FastifyReply) {
    const params = postQuerySchema.parse(req.query);
    const result = await postsService.listPosts(params, req.fingerprint);
    return reply.send({
      success: true,
      data: result.items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  }

  public async getPost(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = req.params;
    const post = await postsService.getPostById(id, req.fingerprint);
    if (!post) {
      return reply.status(404).send({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Post not found' },
      });
    }
    return reply.send({
      success: true,
      data: post,
    });
  }

  public async createPost(req: FastifyRequest, reply: FastifyReply) {
    const input = createPostSchema.parse(req.body);
    const newPost = await postsService.createPost(input, req.fingerprint);
    return reply.status(201).send({
      success: true,
      data: newPost,
    });
  }

  public async searchPosts(req: FastifyRequest, reply: FastifyReply) {
    const params = searchQuerySchema.parse(req.query);
    const result = await postsService.searchPosts(params);
    return reply.send({
      success: true,
      data: result.items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  }
}

export const postsController = new PostsController();
