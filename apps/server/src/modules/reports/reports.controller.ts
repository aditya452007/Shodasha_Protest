import { FastifyRequest, FastifyReply } from 'fastify';
import { reportsService } from './reports.service.js';
import { reportSchema } from '@shodasha/shared';

export class ReportsController {
  public async submitReport(req: FastifyRequest, reply: FastifyReply) {
    const { postId, commentId, reason, details } = reportSchema.parse(req.body);

    const report = await reportsService.submitReport(
      req.fingerprint,
      reason,
      postId,
      commentId,
      details
    );

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
