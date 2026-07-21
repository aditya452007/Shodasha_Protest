export declare class VotesService {
    voteOnPost(postId: string, voteValue: 1 | -1, voterHash: string): Promise<{
        postId: string;
        upvotes: number;
        downvotes: number;
        netVotes: number;
        trendingScore: number;
        userVote: number;
    }>;
}
export declare const votesService: VotesService;
//# sourceMappingURL=votes.service.d.ts.map