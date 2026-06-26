# Walkthrough: Monitoring & Error Tracking Setup

All tasks for **Task 9.2: Monitoring & Error Tracking Setup** have been successfully implemented and verified on the fresh branch. Below is the summary of modifications and validation outcomes.

## Changes Made

### 1. Observability Dependencies

- Installed and configured Sentry for Next.js (`@sentry/nextjs`) and Vercel Web Analytics (`@vercel/analytics`).

### 2. Sentry SDK Initializations & Next.js 15 Instrumentation

- **[sentry.client.config.ts](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/sentry.client.config.ts)**: Configures browser tracing and session replay capture.
- **[sentry.server.config.ts](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/sentry.server.config.ts)**: Configures server-side telemetry capture.
- **[sentry.edge.config.ts](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/sentry.edge.config.ts)**: Configures Edge runtime middleware monitoring.
- **[instrumentation.ts](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/instrumentation.ts)**: Configures startup registry initialization to load Sentry for Next.js 15, and instruments `onRequestError` to capture server component rendering exceptions.
- **[next.config.js](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/next.config.js)**: Wrapped configuration using `withSentryConfig` to enable sourcemap uploads, tunnel route mapping, and debug log tree-shaking.

### 3. Application Resilience & Global Boundaries

- **[global-error.tsx](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/app/global-error.tsx)**: Root-level Client Component capturing and reporting critical crashes that bypass the root layout.
- **[error.tsx](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/app/error.tsx)**: Standard React boundary Client Component to isolate route-segment-specific errors.
- **[api-handler.ts](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/lib/api-handler.ts)**: Updated the backend wrapper `withErrorHandler` to catch and log unhandled API route errors to Sentry.

### 4. User Analytics

- **[layout.tsx](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/app/layout.tsx)**: Mounted `<Analytics />` from `@vercel/analytics/react` to collect user-centric performance vitals.

### 5. Documentation

- **[monitoring.md](file:///c:/Users/zaidi/Downloads/compliance-dev%20%284%29/compliance-dev/docs/monitoring.md)**: Created a detailed ops guide documenting:
  - Sentry configuration and pipeline tunneling setup.
  - Alert rules specifications (Error Rate > 1%, p95 transaction response time > 1s).
  - Production database queries to monitor pool saturation, query performance/blocking, and index stats.

---

## Verification & Test Results

### 1. TypeScript Check

Running `pnpm type-check` compiles all packages and Sentry files successfully:

```
> compliance@0.1.0 type-check C:\Users\zaidi\Downloads\compliance-dev (4)\compliance-dev
> tsc --noEmit

(Clean Exit)
```

### 2. Test Suite Check

Running `pnpm test run` ensures that all 328 unit and integration tests continue to pass:

```
 Test Files  53 passed (53)
      Tests  328 passed (328)
   Start at  13:21:59
   Duration  7.18s
```

### 3. Production Build Compilation

Running `pnpm build` executes cleanly, registering the Sentry source-map upload hook and compiling successfully:

```
 ✓ Generating static pages (43/43)
   Finalizing page optimization ...
   Collecting build traces ...
(Clean Exit)
```
