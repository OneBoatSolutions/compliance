// ---------------------------------------------------------------------------
// Sentry — Server-side SDK initialisation
// ---------------------------------------------------------------------------
// This file is loaded by Next.js automatically via the instrumentation hook
// for Node.js server bundles (API routes, Server Components, middleware, etc.).
//
// It runs once per Node.js worker process.
// ---------------------------------------------------------------------------

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ── Performance Monitoring ───────────────────────────────────────────────
  // Sample 10% of server-side transactions in production.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // ── Environment ──────────────────────────────────────────────────────────
  environment: process.env.NODE_ENV ?? "development",

  // ── Debug ────────────────────────────────────────────────────────────────
  debug: false,

  // ── Before Send ──────────────────────────────────────────────────────────
  beforeSend(event) {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }
    return event;
  },
});
