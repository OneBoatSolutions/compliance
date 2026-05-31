import { Pool, type PoolConfig } from "pg";

const globalForPool = globalThis as unknown as {
  pgPool: Pool | undefined;
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPgPoolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  return {
    connectionString,
    max: parsePositiveInt(process.env.DATABASE_POOL_MAX, 10),
    min: parsePositiveInt(process.env.DATABASE_POOL_MIN, 0),
    idleTimeoutMillis: parsePositiveInt(process.env.DATABASE_POOL_IDLE_MS, 30_000),
    connectionTimeoutMillis: parsePositiveInt(
      process.env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
      5_000,
    ),
    allowExitOnIdle: process.env.NODE_ENV !== "production",
  };
}

export function getPgPool(): Pool {
  if (!globalForPool.pgPool) {
    globalForPool.pgPool = new Pool(getPgPoolConfig());
  }

  return globalForPool.pgPool;
}
