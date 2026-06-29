// ---------------------------------------------------------------------------
// Sentry — Client-side SDK initialisation
// ---------------------------------------------------------------------------
// This file is loaded by Next.js automatically via the instrumentation hook
// for client-side bundles.  It configures error capturing and performance
// monitoring in the browser.
//
// ⚠️  Keep this file lightweight — every byte here is shipped to the client.
// ---------------------------------------------------------------------------

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ── Performance Monitoring ───────────────────────────────────────────────
  // Sample 10% of transactions in production for performance data.
  // Adjust this value based on traffic volume and Sentry quota.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // ── Replay (Session Replay) ──────────────────────────────────────────────
  // Disabled by default to minimise bundle size and privacy impact.
  // Uncomment and configure if session replay is desired.
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1.0,

  // ── Environment ──────────────────────────────────────────────────────────
  environment: process.env.NODE_ENV ?? "development",

  // ── Debug ────────────────────────────────────────────────────────────────
  // Enable Sentry debug logging in development only.
  debug: false,

  // ── Before Send ──────────────────────────────────────────────────────────
  // Filter or scrub events before they reach Sentry.
  beforeSend(event) {
    // Drop events when DSN is not configured (local development).
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }
    return event;
  },
});
