import { commentsService } from './comments.service.js';
import { createCommentSchema } from '@shodasha/shared';
export class CommentsController {
    async listComments(req, reply) {
        const { postId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;
        const result = await commentsService.listComments(postId, page, limit);
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
    async createComment(req, reply) {
        const { postId } = req.params;
        const input = createCommentSchema.parse(req.body);
        const newComment = await commentsService.createComment(postId, input, req.fingerprint);
        return reply.status(201).send({
            success: true,
            data: newComment,
        });
    }
}
export const commentsController = new CommentsController();
//# sourceMappingURL=comments.controller.js.map