// ---------------------------------------------------------------------------
// Sentry — Edge Runtime SDK initialisation
// ---------------------------------------------------------------------------
// This file is loaded by Next.js for edge-runtime bundles (edge middleware,
// edge API routes).  The edge SDK is a lighter subset of the Node.js SDK.
// ---------------------------------------------------------------------------

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ── Performance Monitoring ───────────────────────────────────────────────
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // ── Environment ──────────────────────────────────────────────────────────
  environment: process.env.NODE_ENV ?? "development",

  // ── Debug ────────────────────────────────────────────────────────────────
  debug: false,
});
