"use client";

// ---------------------------------------------------------------------------
// Global Error Boundary — Catches unhandled errors across the entire app
// ---------------------------------------------------------------------------
// Next.js requires this file at app/global-error.tsx to catch errors in the
// root layout.  It replaces the entire <html> shell when an error occurs.
//
// Sentry is notified via captureException, and the user sees a minimal
// recovery UI with a retry button.
// ---------------------------------------------------------------------------

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report the error to Sentry (only if DSN is configured).
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#fafafa",
          color: "#111",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480, padding: 32 }}>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>
            An unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 8,
              border: "1px solid #ddd",
              backgroundColor: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
