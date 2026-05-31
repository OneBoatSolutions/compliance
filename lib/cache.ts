import { redis } from "./redis";

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    if (data) {
      // eslint-disable-next-line no-console
      console.log(`[Cache HIT] ${key}`);
      return JSON.parse(data) as T;
    }
    // eslint-disable-next-line no-console
    console.log(`[Cache MISS] ${key}`);
    return null;
  } catch (error) {
    console.warn(`[Cache GET Error] ${key}:`, error);
    return null;
  }
}

export async function setCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (error) {
    console.warn(`[Cache SET Error] ${key}:`, error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
    // eslint-disable-next-line no-console
    console.log(`[Cache INVALIDATED] ${key}`);
  } catch (error) {
    console.warn(`[Cache DEL Error] ${key}:`, error);
  }
}
