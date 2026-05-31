"use client";

import dynamic from "next/dynamic";

const OnboardingForm = dynamic(() => import("./onboarding-form"), {
  loading: () => (
    <div className="flex min-h-[50vh] items-center justify-center p-6 text-sm text-muted-foreground">
      Loading onboarding...
    </div>
  ),
});

export default function OnboardingPage() {
  return <OnboardingForm />;
}
