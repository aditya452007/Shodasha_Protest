import { FastifyInstance } from 'fastify';
import { categoriesController } from './categories.controller.js';

export async function categoriesRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/api/v1/categories',
    categoriesController.listCategories.bind(categoriesController)
  );
}
