export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    createdAt: string;
}
export interface Post {
    id: string;
    title: string;
    body: string;
    categoryId: string;
    categoryName?: string;
    categorySlug?: string;
    postType?: string;
    upvotes: number;
    downvotes: number;
    netVotes: number;
    commentCount: number;
    trendingScore: number;
    reportCount: number;
    links: string[];
    status: 'active' | 'hidden' | 'quarantined';
    userVote?: number;
    createdAt: string;
    updatedAt: string;
}
export interface Comment {
    id: string;
    postId: string;
    body: string;
    reportCount: number;
    status: 'active' | 'hidden';
    createdAt: string;
}
export interface Vote {
    id: string;
    postId: string;
    voterHash: string;
    voteValue: number;
    createdAt: string;
}
export interface Report {
    id: string;
    postId?: string;
    commentId?: string;
    reporterHash: string;
    reason: string;
    details?: string;
    createdAt: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface SSEUpdatePayload {
    type: 'post_created' | 'vote_updated' | 'comment_added';
    postId: string;
    title?: string;
    upvotes?: number;
    downvotes?: number;
    commentCount?: number;
    trendingScore?: number;
    createdAt?: string;
}
//# sourceMappingURL=index.d.ts.map