import { Redis } from 'ioredis';
import RedisMock from 'ioredis-mock';

// Enforcing Phase 1 absolute requirement: "Redis mandatory connection fail-fast"
// For local development on Windows without Docker, fallback to mock strictly in DEV.
const isDev = process.env.NODE_ENV !== 'production';

let redisClient;

if (isDev && (!process.env.REDIS_URL || process.env.REDIS_URL.includes('localhost'))) {
    console.warn('⚠️ [DEV MODE] Using ioredis-mock since local Redis/Docker is unavailable. NOT for production.');
    redisClient = new RedisMock();
} else {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => {
            if (times > 3) {
                console.error('FATAL: Redis connection failed entirely. Enforcing mandatory connection fail-fast.');
                process.exit(1);
            }
            return Math.min(times * 100, 3000);
        }
    });
}

redisClient.on('error', (err) => {
    console.error('Redis Error:', err.message);
});

redisClient.on('connect', () => {
    console.log('[INFRA] Redis connected successfully for Session Lock and Token Blacklist.');
});

export default redisClient;
