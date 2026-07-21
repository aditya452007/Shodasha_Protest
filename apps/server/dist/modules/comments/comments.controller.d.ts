import { FastifyRequest, FastifyReply } from 'fastify';
export declare class CommentsController {
    listComments(req: FastifyRequest<{
        Params: {
            postId: string;
        };
        Querystring: {
            page?: number;
            limit?: number;
        };
    }>, reply: FastifyReply): Promise<never>;
    createComment(req: FastifyRequest<{
        Params: {
            postId: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const commentsController: CommentsController;
//# sourceMappingURL=comments.controller.d.ts.map