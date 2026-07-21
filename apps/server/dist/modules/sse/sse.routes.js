import { sseService } from './sse.service.js';
export async function sseRoutes(fastify) {
    fastify.get('/api/v1/posts/stream', async (req, reply) => {
        reply.raw.setHeader('Content-Type', 'text/event-stream');
        reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
        reply.raw.setHeader('Connection', 'keep-alive');
        reply.raw.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx/Cloudflare buffering
        reply.raw.write(': ping\n\n'); // Initial handshake comment
        sseService.addClient(reply);
        // Keep connection alive with periodic heartbeats every 25 seconds
        const interval = setInterval(() => {
            reply.raw.write(': heartbeat\n\n');
        }, 25000);
        req.raw.on('close', () => {
            clearInterval(interval);
        });
    });
}
//# sourceMappingURL=sse.routes.js.map