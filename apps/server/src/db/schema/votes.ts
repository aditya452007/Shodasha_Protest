import { pgTable, uuid, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { posts } from './posts.js';

export const votes = pgTable(
  'votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    voterHash: varchar('voter_hash', { length: 64 }).notNull(),
    voteValue: integer('vote_value').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniquePostVoter: uniqueIndex('idx_votes_post_voter').on(table.postId, table.voterHash),
  })
);
