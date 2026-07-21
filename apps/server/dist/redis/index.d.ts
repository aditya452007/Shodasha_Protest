import { Redis } from 'ioredis';
export declare const redis: Redis;
export declare const REDIS_KEYS: {
    readonly rateLimit: (fingerprint: string, action: string) => string;
    readonly contentHash: (hash: string) => string;
    readonly homepageFeed: (sort: string, category: string, page: number) => string;
    readonly trendingZSet: "zset:trending";
    readonly hotPost: (postId: string) => string;
};
export declare function safeRedisGet(key: string): Promise<string | null>;
export declare function safeRedisSetEx(key: string, seconds: number, value: string): Promise<void>;
export declare function safeRedisIncr(key: string, windowSeconds: number): Promise<number>;
export declare function safeRedisKeys(pattern: string): Promise<string[]>;
export declare function safeRedisDel(...keys: string[]): Promise<void>;
//# sourceMappingURL=index.d.ts.map