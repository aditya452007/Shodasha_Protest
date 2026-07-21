class SSEService {
    clients = new Set();
    addClient(reply) {
        this.clients.add(reply);
        reply.raw.on('close', () => {
            this.clients.delete(reply);
        });
    }
    broadcast(event) {
        const dataString = `data: ${JSON.stringify(event)}\n\n`;
        for (const client of this.clients) {
            client.raw.write(dataString);
        }
    }
    getConnectedClientsCount() {
        return this.clients.size;
    }
}
export const sseService = new SSEService();
//# sourceMappingURL=sse.service.js.map