# Observability, Monitoring & Alerting Guide

This document describes the application’s telemetry architecture, including Sentry error boundaries, Vercel Analytics performance tracking, Sentry alerts, and PostgreSQL query monitoring parameters.

---

## 1. Sentry Configuration

Sentry handles client, server, and edge exception capture.

- **Initialization**:
  - **Browser**: `instrumentation-client.ts` (Next.js 15 client instrumentation hook)
  - **Node.js server**: `sentry.server.config.ts`, loaded via `instrumentation.ts` when `NEXT_RUNTIME === "nodejs"`
  - **Edge middleware**: `sentry.edge.config.ts`, loaded via `instrumentation.ts` when `NEXT_RUNTIME === "edge"`
- **Environment variables**: Set both `SENTRY_DSN` (server) and `NEXT_PUBLIC_SENTRY_DSN` (browser) in production. Local dev works without them.
- **Build Integration**: `next.config.js` wraps the configuration in `withSentryConfig` to enable source-map injection and debug-log tree-shaking (`webpack.treeshake.removeDebugLogging`).

### Active Exception Capture

1.  **React Error Boundaries**:
    - Root layout failures are captured by `app/global-error.tsx`.
    - Dynamic route segment rendering errors are caught by `app/error.tsx` boundaries.
2.  **API Handler Wrapper**:
    - Unhandled failures inside `withErrorHandler` (`lib/api-handler.ts`) are dispatched automatically.

---

## 2. Telemetry Alerting Profiles

Configure these rules manually in the [Sentry dashboard](https://sentry.io) for project `compliance-dashboard` (org: `one-boat-solutions`):

1. Sign in → **Alerts** → **Create Alert** → **Issues** or **Performance**
2. Create **Alert Rule A** (error rate) and **Alert Rule B** (p95 latency) as defined below
3. Connect Slack or email notification actions for each rule
4. In Vercel → project **Analytics** tab, confirm Web Vitals collection is enabled

Sentry dashboards must be configured with the following production notification alert rules:

### Alert Rule A: Error Rate Spike (>1%)

- **Condition**: Triggered when the ratio of `5xx` errors to total HTTP requests exceeds `1%` within any sliding `5-minute` window.
- **Filter**: `event.type:error AND transaction.op:http.server`
- **Action**: Send high-priority alert to slack/email channel for immediate triage.

### Alert Rule B: Slow HTTP Transactions (p95 > 1s)

- **Condition**: Triggered when the 95th percentile latency (`p95`) of HTTP request durations exceeds `1,000ms` (1 second) over a `15-minute` window.
- **Filter**: `transaction.op:http.server`
- **Action**: Dispatch performance ticket alert to target resolution queues.

### Post-deploy verification checklist

After deploying to Vercel with `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` set:

1. Open the app and trigger a client error (e.g. visit a route that throws in `app/error.tsx` boundary during testing).
2. Confirm the event appears in Sentry within a few minutes.
3. Confirm Vercel **Analytics → Web Vitals** shows data after real traffic.
4. Confirm both alert rules (A and B above) are **Active** and notifications reach your team channel.

Production trace sampling is set to **10%** (`tracesSampleRate: 0.1`) in `instrumentation-client.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.

---

## 3. Vercel Analytics Setup

- **Package**: `@vercel/analytics` is installed and tracked globally.
- **Integration**: Loaded inside the root HTML layout body (`app/layout.tsx`) using the `<Analytics />` component.
- **Metrics Collected**: Real-user Web Vitals (LCP, FID, CLS, INP, FCP) and performance rankings.

---

## 4. Database Monitoring Queries (PostgreSQL)

Execute these SQL commands on the target database instance to check connection pools, queries performance, and cache hit metrics.

### A. Monitor Connection Pool Saturation

Checks total connection counts, active vs idle queries, and identifying stalled connections.

```sql
SELECT
  state,
  count(*),
  pg_size_pretty(sum(pg_relation_size(pg_class.oid))) as temp_space_utilization
FROM pg_stat_activity
LEFT JOIN pg_class ON pg_class.relname = 'pg_stat_activity'
WHERE datname = current_database()
GROUP BY state;
```

### B. Track Running Queries (Longer than 1 Second)

Lists all active queries currently running that have been executing for more than 1 second. Useful for identifying query locks.

```sql
SELECT
  pid,
  now() - query_start AS duration,
  query,
  state,
  wait_event_type,
  wait_event
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - query_start > interval '1 second'
ORDER BY duration DESC;
```

### C. Top 10 Slowest SQL Queries (By Total Runtime)

Identifies database optimization targets (requires `pg_stat_statements` extension enabled).

```sql
SELECT
  query,
  calls,
  total_exec_time / 60000.0 AS total_runtime_minutes,
  mean_exec_time AS average_execution_time_ms,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### D. Index Cache Hit Rate

Evaluates index utilization. Ratio should ideally be `> 0.99` (99% of indexes read from memory cache).

```sql
SELECT
  sum(idx_blks_hit) as cache_hits,
  sum(idx_blks_read) as disk_reads,
  sum(idx_blks_hit) / (sum(idx_blks_hit) + sum(idx_blks_read) + 0.0001) AS index_cache_hit_ratio
FROM pg_statio_all_indexes;
```

### E. Table Sizes & Row Allocations

Identifies disk storage hogs.

```sql
SELECT
  relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  pg_size_pretty(pg_relation_size(relid)) AS data_size,
  pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size,
  n_dead_tup as dead_tuples
FROM pg_catalog.pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```
