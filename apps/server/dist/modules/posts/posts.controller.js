import { postsService } from './posts.service.js';
import { postQuerySchema, createPostSchema, searchQuerySchema } from '@shodasha/shared';
export class PostsController {
    async listPosts(req, reply) {
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
    async getPost(req, reply) {
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
    async createPost(req, reply) {
        const input = createPostSchema.parse(req.body);
        const newPost = await postsService.createPost(input, req.fingerprint);
        return reply.status(201).send({
            success: true,
            data: newPost,
        });
    }
    async searchPosts(req, reply) {
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
//# sourceMappingURL=posts.controller.js.map