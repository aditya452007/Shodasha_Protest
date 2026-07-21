import { buildApp } from './app.js';
import { config } from './config/index.js';
import { queryClient } from './db/index.js';
import { redis } from './redis/index.js';
async function start() {
    const app = await buildApp();
    try {
        await app.listen({ port: config.PORT, host: config.HOST });
        app.log.info(`Server listening on http://${config.HOST}:${config.PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
    const gracefulShutdown = async (signal) => {
        app.log.info(`Received ${signal}. Shutting down gracefully...`);
        try {
            await app.close();
            await queryClient.end();
            redis.disconnect();
            app.log.info('Closed database connection & Redis server connection.');
            process.exit(0);
        }
        catch (err) {
            app.log.error(err, 'Error during graceful shutdown');
            process.exit(1);
        }
    };
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}
start();
//# sourceMappingURL=server.js.map