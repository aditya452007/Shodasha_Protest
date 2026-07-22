import { Redis } from 'ioredis';
import { config } from '../config/index.js';
let isErrorLogged = false;
export const redis = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy(times) {
        if (times > 3) {
            if (!isErrorLogged) {
                console.warn('⚠️ Redis server is offline on 127.0.0.1:6379. Falling back to fast in-memory dev cache.\n   To run Redis & Postgres via Docker: npm run services:up');
                isErrorLogged = true;
            }
            return null; // Stop retrying endlessly
        }
        return 500;
    },
    lazyConnect: true,
});
redis.on('error', (_err) => {
    if (!isErrorLogged) {
        console.warn('⚠️ Redis server connection refused. Using in-memory fallback for local development.');
        isErrorLogged = true;
    }
});
redis.on('connect', () => {
    // Silent connection for production cleanliness
    isErrorLogged = false;
});
// Cache Keys Helper (Strict boundary enforcement)
export const REDIS_KEYS = {
    rateLimit: (fingerprint, action) => `rl:${action}:${fingerprint}`,
    contentHash: (hash) => `dup:${hash}`,
    homepageFeed: (sort, category, page) => `cache:feed:${sort}:${category || 'all'}:${page}`,
    trendingZSet: 'zset:trending',
    hotPost: (postId) => `cache:post:${postId}`,
};
// In-memory fallback datastore when Redis container is not running locally
const inMemoryStore = new Map();
export async function safeRedisGet(key) {
    if (redis.status === 'ready') {
        try {
            return await redis.get(key);
        }
        catch {
            // Fall through to in-memory store
        }
    }
    const item = inMemoryStore.get(key);
    if (!item)
        return null;
    if (Date.now() > item.expiresAt) {
        inMemoryStore.delete(key);
        return null;
    }
    return item.value;
}
export async function safeRedisSetEx(key, seconds, value) {
    if (redis.status === 'ready') {
        try {
            await redis.setex(key, seconds, value);
            return;
        }
        catch {
            // Fall through to in-memory store
        }
    }
    inMemoryStore.set(key, { value, expiresAt: Date.now() + seconds * 1000 });
}
export async function safeRedisIncr(key, windowSeconds) {
    if (redis.status === 'ready') {
        try {
            const count = await redis.incr(key);
            if (count === 1) {
                await redis.expire(key, windowSeconds);
            }
            return count;
        }
        catch {
            // Fall through to in-memory store
        }
    }
    const now = Date.now();
    const item = inMemoryStore.get(key);
    if (!item || now > item.expiresAt) {
        inMemoryStore.set(key, { value: '1', expiresAt: now + windowSeconds * 1000 });
        return 1;
    }
    const newCount = parseInt(item.value, 10) + 1;
    inMemoryStore.set(key, { value: newCount.toString(), expiresAt: item.expiresAt });
    return newCount;
}
export async function safeRedisKeys(pattern) {
    if (redis.status === 'ready') {
        try {
            return await redis.keys(pattern);
        }
        catch {
            // Fall through
        }
    }
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const matched = [];
    const now = Date.now();
    for (const [k, item] of inMemoryStore.entries()) {
        if (now > item.expiresAt) {
            inMemoryStore.delete(k);
        }
        else if (regex.test(k)) {
            matched.push(k);
        }
    }
    return matched;
}
export async function safeRedisDel(...keys) {
    if (!keys.length)
        return;
    if (redis.status === 'ready') {
        try {
            await redis.del(...keys);
        }
        catch {
            // Fall through
        }
    }
    for (const k of keys) {
        inMemoryStore.delete(k);
    }
}
//# sourceMappingURL=index.js.map