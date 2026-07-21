import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { fingerprintMiddleware } from './middleware/fingerprint.js';
import { postsRoutes } from './modules/posts/posts.routes.js';
import { commentsRoutes } from './modules/comments/comments.routes.js';
import { votesRoutes } from './modules/votes/votes.routes.js';
import { reportsRoutes } from './modules/reports/reports.routes.js';
import { categoriesRoutes } from './modules/categories/categories.routes.js';
import { sseRoutes } from './modules/sse/sse.routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport:
        config.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'HH:MM:ss Z' },
            }
          : undefined,
    },
    bodyLimit: 1048576, // 1 MB payload limit max
  });

  // Security Plugins
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });

  await app.register(fastifyCors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Client-UUID'],
  });

  await app.register(fastifyCookie, {
    secret: config.COOKIE_SECRET,
  });

  await app.register(import('@fastify/rate-limit'), {
    max: 100, // default limit 100 requests
    timeWindow: '1 minute',
    keyGenerator: (req) => req.fingerprint || req.ip, // use fingerprint or IP
  });

  // Global Fingerprinting Middleware
  app.addHook('onRequest', fingerprintMiddleware);

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Health Check Endpoint
  app.get('/health', async (_req, reply) => {
    return reply.send({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Register Module Routes
  await app.register(postsRoutes);
  await app.register(commentsRoutes);
  await app.register(votesRoutes);
  await app.register(reportsRoutes);
  await app.register(categoriesRoutes);
  await app.register(sseRoutes);

  return app;
}
