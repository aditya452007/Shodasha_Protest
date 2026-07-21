import { pgTable, uuid, varchar, text, integer, doublePrecision, jsonb, timestamp, index, } from 'drizzle-orm/pg-core';
import { categories } from './categories.js';
export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 120 }).notNull(),
    body: text('body').notNull(),
    categoryId: uuid('category_id')
        .references(() => categories.id, { onDelete: 'restrict' })
        .notNull(),
    postType: varchar('post_type', { length: 30 }).default('discussion').notNull(),
    upvotes: integer('upvotes').default(0).notNull(),
    downvotes: integer('downvotes').default(0).notNull(),
    commentCount: integer('comment_count').default(0).notNull(),
    trendingScore: doublePrecision('trending_score').default(0).notNull(),
    reportCount: integer('report_count').default(0).notNull(),
    links: jsonb('links').$type().default([]).notNull(),
    status: varchar('status', { length: 20 }).default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    createdAtIdx: index('idx_posts_created_at').on(table.createdAt.desc()),
    trendingScoreIdx: index('idx_posts_trending_score').on(table.trendingScore.desc()),
    categoryIdx: index('idx_posts_category_id').on(table.categoryId),
    statusIdx: index('idx_posts_status').on(table.status),
}));
//# sourceMappingURL=posts.js.map