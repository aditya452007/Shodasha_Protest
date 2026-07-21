import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema/index.js';
import { safeRedisGet, safeRedisSetEx } from '../../redis/index.js';

export class CategoriesController {
  public async listCategories(_req: FastifyRequest, reply: FastifyReply) {
    const cacheKey = 'cache:categories';
    const cached = await safeRedisGet(cacheKey);

    if (cached) {
      return reply.send({
        success: true,
        data: JSON.parse(cached),
      });
    }

    const items = await db.select().from(categories);

    await safeRedisSetEx(cacheKey, 3600, JSON.stringify(items));

    return reply.send({
      success: true,
      data: items,
    });
  }
}

export const categoriesController = new CategoriesController();
