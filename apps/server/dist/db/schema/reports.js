import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { posts } from './posts.js';
import { comments } from './comments.js';
export const reports = pgTable('reports', {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    reporterHash: varchar('reporter_hash', { length: 64 }).notNull(),
    reason: varchar('reason', { length: 30 }).notNull(),
    details: varchar('details', { length: 300 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
//# sourceMappingURL=reports.js.map