import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  tracesSampleRate: isProd ? 0.1 : 1.0,

  debug: false,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: isProd ? 0.1 : 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
