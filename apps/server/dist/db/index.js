import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/index.js';
import * as schema from './schema/index.js';
const isRemoteSsl = config.DATABASE_URL.includes('supabase') ||
    config.DATABASE_URL.includes('sslmode=require') ||
    config.NODE_ENV === 'production';
// Connection configured for PgBouncer / Supabase transaction pooling mode
export const queryClient = postgres(config.DATABASE_URL, {
    max: 20,
    idle_timeout: 30,
    connect_timeout: 10,
    prepare: false, // Required for PgBouncer transaction mode
    ssl: isRemoteSsl ? 'require' : false,
});
export const db = drizzle(queryClient, { schema });
//# sourceMappingURL=index.js.map