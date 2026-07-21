import { FastifyReply } from 'fastify';
import { SSEUpdatePayload } from '@shodasha/shared';
type ClientReply = FastifyReply;
declare class SSEService {
    private clients;
    addClient(reply: ClientReply): void;
    broadcast(event: SSEUpdatePayload): void;
    getConnectedClientsCount(): number;
}
export declare const sseService: SSEService;
export {};
//# sourceMappingURL=sse.service.d.ts.map