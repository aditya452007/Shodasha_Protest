import { FastifyRequest, FastifyReply } from 'fastify';
declare module 'fastify' {
    interface FastifyRequest {
        fingerprint: string;
        anonCookieId: string;
    }
}
export declare function fingerprintMiddleware(req: FastifyRequest, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=fingerprint.d.ts.map