import { FastifyInstance } from 'fastify';
import { reportsController } from './reports.controller.js';
import { createRateLimiter } from '../../middleware/rateLimiter.js';

export async function reportsRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/api/v1/reports',
    { preHandler: [createRateLimiter('report')] },
    reportsController.submitReport.bind(reportsController)
  );
}
