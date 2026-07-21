import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError | ZodError | Error,
  req: FastifyRequest,
  reply: FastifyReply
) {
  req.log.error({ err: error, url: req.url, method: req.method }, 'API Request Error');

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.flatten(),
      },
    });
  }

  const statusCode = (error as FastifyError).statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  return reply.status(statusCode).send({
    success: false,
    data: null,
    error: {
      code: (error as FastifyError).code || 'SERVER_ERROR',
      message,
    },
  });
}
