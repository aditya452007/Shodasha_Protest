import postgres from 'postgres';
import { config } from '../config/index.js';

const dbUrl = process.env.DIRECT_URL || config.DATABASE_URL;

console.log('Connecting to Supabase PostgreSQL database...');

const sql = postgres(dbUrl, { max: 1, ssl: 'require', prepare: false });

async function runMigration() {
  try {
    console.log('Creating database tables and indexes in Supabase...');

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(120) NOT NULL,
        body TEXT NOT NULL,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        post_type VARCHAR(30) NOT NULL DEFAULT 'discussion',
        upvotes INTEGER NOT NULL DEFAULT 0,
        downvotes INTEGER NOT NULL DEFAULT 0,
        comment_count INTEGER NOT NULL DEFAULT 0,
        trending_score DOUBLE PRECISION NOT NULL DEFAULT 0,
        report_count INTEGER NOT NULL DEFAULT 0,
        links JSONB NOT NULL DEFAULT '[]'::jsonb,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_trending_score ON posts (trending_score DESC);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts (category_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_posts_fts ON posts USING gin(to_tsvector('english', title || ' ' || body));`;

    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        body VARCHAR(300) NOT NULL,
        report_count INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at ASC);`;

    await sql`
      CREATE TABLE IF NOT EXISTS votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        voter_hash VARCHAR(64) NOT NULL,
        vote_value INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT idx_votes_post_voter UNIQUE (post_id, voter_hash)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        reporter_hash VARCHAR(64) NOT NULL,
        reason VARCHAR(30) NOT NULL,
        details VARCHAR(300),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    // Safe migration: add post_type column if it doesn't exist (for existing databases)
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'posts' AND column_name = 'post_type'
        ) THEN
          ALTER TABLE posts ADD COLUMN post_type VARCHAR(30) NOT NULL DEFAULT 'discussion';
        END IF;
      END $$;
    `;

    console.log('✅ Supabase PostgreSQL schema migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
