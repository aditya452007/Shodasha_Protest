import { ZodError } from 'zod';
export function errorHandler(error, req, reply) {
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
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;
    return reply.status(statusCode).send({
        success: false,
        data: null,
        error: {
            code: error.code || 'SERVER_ERROR',
            message,
        },
    });
}
//# sourceMappingURL=errorHandler.js.map