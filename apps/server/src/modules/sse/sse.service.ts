import { FastifyReply } from 'fastify';
import { SSEUpdatePayload } from '@shodasha/shared';

type ClientReply = FastifyReply;

class SSEService {
  private clients: Set<ClientReply> = new Set();

  public addClient(reply: ClientReply) {
    this.clients.add(reply);
    reply.raw.on('close', () => {
      this.clients.delete(reply);
    });
  }

  public broadcast(event: SSEUpdatePayload) {
    const dataString = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of this.clients) {
      client.raw.write(dataString);
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const sseService = new SSEService();
