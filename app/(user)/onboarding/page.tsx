// app/(user)/onboarding/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 p-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Onboarding</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        This is a placeholder page. CTA from dashboard works!
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
      >
        Go Back to Dashboard
      </button>
    </div>
  );
}
