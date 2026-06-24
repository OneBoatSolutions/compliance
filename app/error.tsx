"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function ErrorBoundary({
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
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <span className="material-symbols-outlined text-2xl font-light">warning</span>
        </div>
        <h3 className="mt-4 text-xl font-bold text-neutral-900">Something went wrong!</h3>
        <p className="mt-2 text-sm text-neutral-500">
          An error occurred in this section of the page. We have logged this event for our team to
          investigate.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition active:scale-98"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
