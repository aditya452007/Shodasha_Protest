import { CreateCommentInput } from '@shodasha/shared';
export declare class CommentsService {
    listComments(postId: string, page?: number, limit?: number): Promise<any>;
    createComment(postId: string, input: CreateCommentInput, _fingerprint: string): Promise<{
        id: string;
        body: string;
    } | {
        createdAt: string;
        status: string;
        id: string;
        body: string;
        reportCount: number;
        postId: string;
    }>;
}
export declare const commentsService: CommentsService;
//# sourceMappingURL=comments.service.d.ts.map