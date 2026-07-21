import { CreatePostInput, PostQueryParams, SearchQueryParams } from '@shodasha/shared';
export declare class PostsService {
    listPosts(params: PostQueryParams, voterHash: string): Promise<any>;
    getPostById(id: string, voterHash: string): Promise<any>;
    createPost(input: CreatePostInput, _fingerprint: string): Promise<{
        id: string;
        title: string;
    } | {
        categoryName: string;
        categorySlug: string;
        netVotes: number;
        userVote: number;
        createdAt: string;
        updatedAt: string;
        status: string;
        id: string;
        title: string;
        body: string;
        categoryId: string;
        postType: string;
        upvotes: number;
        downvotes: number;
        commentCount: number;
        trendingScore: number;
        reportCount: number;
        links: string[];
    }>;
    searchPosts(params: SearchQueryParams): Promise<{
        items: {
            netVotes: number;
            links: string[];
            createdAt: string;
            updatedAt: string;
            id: string;
            title: string;
            body: string;
            categoryId: string;
            categoryName: string | null;
            categorySlug: string | null;
            postType: string;
            upvotes: number;
            downvotes: number;
            commentCount: number;
            trendingScore: number;
            reportCount: number;
            status: string;
        }[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    private attachUserVotes;
}
export declare const postsService: PostsService;
//# sourceMappingURL=posts.service.d.ts.map