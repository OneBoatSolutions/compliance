# Monitoring & Error Tracking — Dashboard Documentation

This document describes the monitoring, error tracking, and analytics infrastructure for the Compliance application.

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Compliance App                                │
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐ │
│  │  Client SDK  │   │  Server SDK  │   │      Edge SDK            │ │
│  │  (Browser)   │   │  (Node.js)   │   │  (Middleware / Edge API) │ │
│  └──────┬───────┘   └──────┬───────┘   └────────────┬─────────────┘ │
│         │                  │                        │               │
│         ▼                  ▼                        ▼               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               Sentry Ingest (*.ingest.sentry.io)             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │         Vercel Analytics (vitals.vercel-insights.com)        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐                                │
│  │  /api/health │   │  /api/ready  │  ← Probe Endpoints            │
│  │  (Liveness)  │   │ (Readiness)  │                                │
│  └──────────────┘   └──────────────┘                                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Sentry Configuration

### 2.1 SDK Files

| File                       | Runtime   | Purpose                                        |
| -------------------------- | --------- | ---------------------------------------------- |
| `sentry.client.config.ts`  | Browser   | Captures client-side errors & performance data |
| `sentry.server.config.ts`  | Node.js   | Captures server-side errors & API latency      |
| `sentry.edge.config.ts`    | Edge      | Captures middleware & edge API errors          |
| `instrumentation.ts`       | Both      | Next.js hook that bootstraps the correct SDK   |

### 2.2 Environment Variables

| Variable                  | Required | Description                                       |
| ------------------------- | -------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SENTRY_DSN`  | Yes      | Sentry Data Source Name (public, safe for client)  |
| `SENTRY_AUTH_TOKEN`       | No       | Auth token for source-map uploads during build     |
| `SENTRY_ORG`              | No       | Sentry organization slug                           |
| `SENTRY_PROJECT`          | No       | Sentry project slug                                |

### 2.3 Sampling Rates

| Environment  | `tracesSampleRate` | Rationale                                    |
| ------------ | ------------------ | -------------------------------------------- |
| Production   | 0.1 (10%)          | Balances observability with Sentry quota      |
| Development  | 1.0 (100%)         | Full visibility during local development      |

---

## 3. Error Boundaries

### 3.1 Global Error Boundary (`app/global-error.tsx`)

- Catches **all unhandled errors** across the entire application, including errors in the root layout.
- Reports to Sentry via `Sentry.captureException()`.
- Renders a minimal recovery UI with a "Try again" button.
- Uses **inline styles only** (CSS may not be available when this boundary triggers).

---

## 4. Vercel Analytics

The `<Analytics />` component from `@vercel/analytics/react` is mounted in `app/layout.tsx`. It automatically tracks:

- **Page views** across all routes
- **Web Vitals** (LCP, FID, CLS, TTFB, INP)
- **Navigation performance**

> **CSP Note**: The `connect-src` directive in `middleware.ts` includes `https://vitals.vercel-insights.com` and `https://va.vercel-scripts.com` to allow Analytics to function under our strict Content Security Policy.

---

## 5. Database Monitoring

### 5.1 Liveness Probe — `GET /api/health`

Returns a simple `{ status: "ok" }` payload with a fresh timestamp. **Does NOT touch the database** by default.

**Optional**: Pass `?db_metrics=true` to include database monitoring metrics:

```json
{
  "status": "ok",
  "timestamp": "2026-06-29T20:00:00.000Z",
  "version": "1.0.0",
  "database": {
    "latencyMs": 12,
    "activeConnections": 3,
    "maxConnections": 100
  }
}
```

### 5.2 Readiness Probe — `GET /api/ready`

Runs deep dependency checks (Database + Redis) concurrently. Returns per-service status:

```json
{
  "status": "ready",
  "services": {
    "database": { "status": "healthy", "latencyMs": 8 },
    "cache": { "status": "healthy", "latencyMs": 2 }
  },
  "timestamp": "2026-06-29T20:00:00.000Z"
}
```

---

## 6. Alert Configuration (Sentry UI)

Configure the following alerts in the Sentry dashboard:

### 6.1 Error Rate Alert

| Setting          | Value                     |
| ---------------- | ------------------------- |
| **Metric**       | Error count               |
| **Threshold**    | > 1% of total events      |
| **Time Window**  | 5 minutes                 |
| **Action**       | Notify via Slack / Email   |
| **Severity**     | Warning                   |

### 6.2 Performance Alert (P95 Latency)

| Setting          | Value                     |
| ---------------- | ------------------------- |
| **Metric**       | Transaction duration (p95) |
| **Threshold**    | > 1000ms (1 second)       |
| **Time Window**  | 10 minutes                |
| **Action**       | Notify via Slack / Email   |
| **Severity**     | Warning                   |

### 6.3 How to Create Alerts in Sentry

1. Navigate to **Alerts** → **Create Alert Rule**
2. Select **Issue Alert** for error rate or **Metric Alert** for performance
3. Configure the conditions using the values above
4. Set notification channels (Slack, Email, PagerDuty, etc.)
5. Save and test the alert

---

## 7. CSP (Content Security Policy) Integration

All monitoring SDKs require network access. The `middleware.ts` CSP has been updated to allow:

| Domain                              | Directive     | Purpose                      |
| ----------------------------------- | ------------- | ---------------------------- |
| `*.ingest.sentry.io`               | `connect-src` | Sentry event ingestion       |
| `*.ingest.us.sentry.io`            | `connect-src` | Sentry US region ingestion   |
| `vitals.vercel-insights.com`       | `connect-src` | Vercel Analytics data        |
| `va.vercel-scripts.com`            | `connect-src` | Vercel Analytics scripts     |

---

## 8. Troubleshooting

### Events not appearing in Sentry

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set in your environment
2. Check browser console for CSP violations
3. Confirm the DSN region matches the ingest domains in CSP

### Vercel Analytics not tracking

1. Ensure the app is deployed on Vercel (Analytics only works in Vercel-hosted environments)
2. Enable Analytics in the Vercel project settings dashboard

### Health endpoint returning database errors

1. Verify `DATABASE_URL` is configured correctly
2. Check connection pool limits in `lib/prisma.ts`
3. Review `/api/ready` for detailed dependency status
