import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/redis", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

import { redis } from "@/lib/redis";
import { getCache, setCache, invalidateCache } from "@/lib/cache";

describe("cache helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCache", () => {
    it("returns parsed value on cache hit", async () => {
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify({ value: 42 }));

      const result = await getCache<{ value: number }>("key1");

      expect(result).toEqual({ value: 42 });
      expect(redis.get).toHaveBeenCalledWith("key1");
    });

    it("returns null on cache miss", async () => {
      vi.mocked(redis.get).mockResolvedValue(null);

      const result = await getCache("missing");

      expect(result).toBeNull();
    });

    it("returns null and logs warning on redis error", async () => {
      vi.mocked(redis.get).mockRejectedValue(new Error("connection refused"));

      const result = await getCache<{ value: number }>("bad");

      expect(result).toBeNull();
    });
  });

  describe("setCache", () => {
    it("serializes and stores value with TTL", async () => {
      vi.mocked(redis.set).mockResolvedValue("OK");

      await setCache("key2", { a: 1 }, 60);

      expect(redis.set).toHaveBeenCalledWith("key2", JSON.stringify({ a: 1 }), "EX", 60);
    });

    it("swallows redis errors and logs warning", async () => {
      vi.mocked(redis.set).mockRejectedValue(new Error("redis down"));

      await expect(setCache("key3", { a: 1 }, 30)).resolves.toBeUndefined();
    });
  });

  describe("invalidateCache", () => {
    it("deletes the key from cache", async () => {
      vi.mocked(redis.del).mockResolvedValue(1);

      await invalidateCache("key4");

      expect(redis.del).toHaveBeenCalledWith("key4");
    });

    it("swallows redis errors and logs warning", async () => {
      vi.mocked(redis.del).mockRejectedValue(new Error("redis down"));

      await expect(invalidateCache("key5")).resolves.toBeUndefined();
    });
  });
});
