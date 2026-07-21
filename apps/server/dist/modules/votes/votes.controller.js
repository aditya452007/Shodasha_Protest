import { votesService } from './votes.service.js';
import { voteSchema } from '@shodasha/shared';
export class VotesController {
    async vote(req, reply) {
        const { id } = req.params;
        const { voteValue } = voteSchema.parse(req.body);
        const result = await votesService.voteOnPost(id, voteValue, req.fingerprint);
        return reply.send({
            success: true,
            data: result,
        });
    }
}
export const votesController = new VotesController();
//# sourceMappingURL=votes.controller.js.map