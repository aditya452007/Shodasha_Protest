import { reportsService } from './reports.service.js';
import { reportSchema } from '@shodasha/shared';
export class ReportsController {
    async submitReport(req, reply) {
        const { postId, commentId, reason, details } = reportSchema.parse(req.body);
        const report = await reportsService.submitReport(req.fingerprint, reason, postId, commentId, details);
        if (!report) {
            throw new Error('Failed to submit report');
        }
        return reply.status(201).send({
            success: true,
            data: {
                id: report.id,
                message: 'Report submitted successfully. Content flagged for community review.',
            },
        });
    }
}
export const reportsController = new ReportsController();
//# sourceMappingURL=reports.controller.js.map