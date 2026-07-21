import { categoriesController } from './categories.controller.js';
export async function categoriesRoutes(fastify) {
    fastify.get('/api/v1/categories', categoriesController.listCategories.bind(categoriesController));
}
//# sourceMappingURL=categories.routes.js.map