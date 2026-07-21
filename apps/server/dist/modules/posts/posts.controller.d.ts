import { FastifyRequest, FastifyReply } from 'fastify';
export declare class PostsController {
    listPosts(req: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPost(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createPost(req: FastifyRequest, reply: FastifyReply): Promise<never>;
    searchPosts(req: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const postsController: PostsController;
//# sourceMappingURL=posts.controller.d.ts.map