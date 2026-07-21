import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'node:crypto';

declare module 'fastify' {
  interface FastifyRequest {
    fingerprint: string;
    anonCookieId: string;
  }
}

export async function fingerprintMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // 1. Get or set secure cookie UUID
  let anonCookieId = req.cookies['anon_id'];
  if (!anonCookieId) {
    anonCookieId = crypto.randomUUID();
    reply.setCookie('anon_id', anonCookieId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });
  }

  // 2. Get client IP address securely
  const cfIp = req.headers['cf-connecting-ip'] as string;
  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  const clientIp = cfIp || (xForwardedFor ? xForwardedFor.split(',')[0]?.trim() : req.ip) || '127.0.0.1';

  // 3. Get client-sent local storage UUID
  const clientStorageUuid = (req.headers['x-client-uuid'] as string) || 'no-client-uuid';

  // 4. User-Agent hash
  const userAgent = req.headers['user-agent'] || 'unknown-ua';
  const uaHash = crypto.createHash('md5').update(userAgent).digest('hex');

  // 5. Combine into SHA-256 Fingerprint
  const combinedRaw = `${anonCookieId}:${clientStorageUuid}:${clientIp}:${uaHash}`;
  const fingerprint = crypto.createHash('sha256').update(combinedRaw).digest('hex');

  req.anonCookieId = anonCookieId;
  req.fingerprint = fingerprint;
}
