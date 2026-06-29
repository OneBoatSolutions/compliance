// ---------------------------------------------------------------------------
// Next.js Instrumentation Hook
// ---------------------------------------------------------------------------
// Next.js 15 calls this file's exported functions at startup to initialise
// observability tooling.  This is the recommended integration point for
// Sentry in the Next.js App Router.
//
// See: https://nextjs.org/docs/app/guides/instrumentation
// ---------------------------------------------------------------------------

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically import server config only in Node.js runtime
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Dynamically import edge config only in edge runtime
    await import("./sentry.edge.config");
  }
}

// Re-export Sentry's captureRequestError handler for automatic API route
// error capture. This wires up server-side error reporting without modifying
// individual route handlers.
export const onRequestError = (
  ...args: Parameters<typeof import("@sentry/nextjs").captureRequestError>
) => {
  import("@sentry/nextjs").then((Sentry) => Sentry.captureRequestError(...args));
};
