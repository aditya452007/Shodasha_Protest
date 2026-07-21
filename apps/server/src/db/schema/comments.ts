import { pgTable, uuid, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { posts } from './posts.js';

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    body: varchar('body', { length: 300 }).notNull(),
    reportCount: integer('report_count').default(0).notNull(),
    status: varchar('status', { length: 20 }).default('active').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    postIdIdx: index('idx_comments_post_id').on(table.postId),
    createdAtIdx: index('idx_comments_created_at').on(table.createdAt.asc()),
  })
);
