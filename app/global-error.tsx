"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-neutral-50 font-sans text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              Application Error
            </h2>
            <p className="mt-4 text-sm text-neutral-600">
              A critical error occurred. The support team has been automatically notified.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all active:scale-98"
              >
                Try again
              </button>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-all active:scale-98"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
