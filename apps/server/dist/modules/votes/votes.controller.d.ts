import { FastifyRequest, FastifyReply } from 'fastify';
export declare class VotesController {
    vote(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const votesController: VotesController;
//# sourceMappingURL=votes.controller.d.ts.map