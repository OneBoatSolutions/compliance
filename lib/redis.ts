import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis };

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis =
  globalForRedis.redis ||
  new Redis(REDIS_URL, {
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      if (times >= 3) {
        console.warn('[Redis] Connection failed. Operating in DB-only mode.');
        return null; 
      }
      return delay;
    },
    maxRetriesPerRequest: 1, 
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('error', (err) => {
  console.error('[Redis Error]', err.message);
});

export default redis;