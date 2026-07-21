import { z } from 'zod';
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodEffects<z.ZodString, string, string>;
    body: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    categorySlug: z.ZodString;
    postType: z.ZodDefault<z.ZodOptional<z.ZodEnum<["eyewitness", "opinion", "event_update", "policy_review", "discussion"]>>>;
    website_url: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    body: string;
    categorySlug: string;
    postType: "eyewitness" | "opinion" | "event_update" | "policy_review" | "discussion";
    website_url: string;
}, {
    title: string;
    body: string;
    categorySlug: string;
    postType?: "eyewitness" | "opinion" | "event_update" | "policy_review" | "discussion" | undefined;
    website_url?: string | undefined;
}>;
export declare const createCommentSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodString, string, string>;
    website_url: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    body: string;
    website_url: string;
}, {
    body: string;
    website_url?: string | undefined;
}>;
export declare const voteSchema: z.ZodObject<{
    voteValue: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<-1>]>;
}, "strip", z.ZodTypeAny, {
    voteValue: 1 | -1;
}, {
    voteValue: 1 | -1;
}>;
export declare const reportSchema: z.ZodEffects<z.ZodObject<{
    postId: z.ZodOptional<z.ZodString>;
    commentId: z.ZodOptional<z.ZodString>;
    reason: z.ZodEnum<["spam", "fake_news", "harassment", "violence", "duplicate", "other"]>;
    details: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: "spam" | "fake_news" | "harassment" | "violence" | "duplicate" | "other";
    postId?: string | undefined;
    commentId?: string | undefined;
    details?: string | undefined;
}, {
    reason: "spam" | "fake_news" | "harassment" | "violence" | "duplicate" | "other";
    postId?: string | undefined;
    commentId?: string | undefined;
    details?: string | undefined;
}>, {
    reason: "spam" | "fake_news" | "harassment" | "violence" | "duplicate" | "other";
    postId?: string | undefined;
    commentId?: string | undefined;
    details?: string | undefined;
}, {
    reason: "spam" | "fake_news" | "harassment" | "violence" | "duplicate" | "other";
    postId?: string | undefined;
    commentId?: string | undefined;
    details?: string | undefined;
}>;
export declare const postQuerySchema: z.ZodObject<{
    sort: z.ZodDefault<z.ZodEnum<["trending", "latest", "top"]>>;
    category: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    sort: "trending" | "latest" | "top";
    page: number;
    limit: number;
    category?: string | undefined;
}, {
    sort?: "trending" | "latest" | "top" | undefined;
    category?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const searchQuerySchema: z.ZodObject<{
    q: z.ZodString;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    q: string;
}, {
    q: string;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type PostQueryParams = z.infer<typeof postQuerySchema>;
export type SearchQueryParams = z.infer<typeof searchQuerySchema>;
//# sourceMappingURL=index.d.ts.map