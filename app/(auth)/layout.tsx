import React from "react";
import AuthRouteTransition from "@/components/auth/auth-route-transition";

function CheckIcon() {
  return (
    <div className="shrink-0 bg-white/10 p-1 rounded-full">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-svh min-h-0 flex-col lg:flex-row overflow-hidden">
      {/* LEFT PANEL */}
      <section className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-[#6d18ff] to-[#4c1d95] text-white p-6 xl:p-14 flex-col justify-between">
        {/* geometric overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none
         bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)]
         bg-size-[40px_40px]"
        />
        {/* glow blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/90 opacity-40 blur-[100px] rounded-full auth-float"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 opacity-40 blur-[100px] rounded-full auth-float-delayed"></div>
        <div className="relative z-10 flex flex-col h-full">
          <svg
            viewBox="0 0 600 600"
            className="absolute right-[-250px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.12] pointer-events-none"
            fill="none"
          >
            <defs>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Shield outline */}
            <path
              d="M300 60 L520 140 V290
       C520 420 400 520 300 560
       C200 520 80 420 80 290
       V140 Z"
              stroke="url(#shieldGrad)"
              strokeWidth="10"
            />
            <path
              d="
  M300 220
  a40 40 0 1 1 -0.1 0
  M280 285
  L320 285
  L340 360
  L260 360
  Z
  "
              fill="url(#shieldGrad)"
            />
          </svg>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 xl:mb-12">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m5.6-4A11.9 11.9 0 0112 2.9a11.9 11.9 0 01-8.6 3A12 12 0 003 9c0 5.6 3.8 10.3 9 11.6C17.2 19.3 21 14.6 21 9c0-1-.13-2-.38-3z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-2xl font-bold">Cipherion</span>
          </div>

          {/* Hero Text */}
          <div className="max-w-xl my-auto">
            <h1 className="text-3xl xl:text-5xl font-bold leading-tight mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              AI-Powered Compliance, Simplified
            </h1>

            <p className="text-white/85 text-base xl:text-lg leading-relaxed mb-6">
              Discover, assess, and maintain regulatory readiness across multiple frameworks
              automatically.
            </p>

            <ul className="space-y-4 xl:space-y-6 text-base xl:text-lg text-white/90">
              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>AI Framework Mapping</span>
              </li>

              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Real-time Compliance Scoring</span>
              </li>

              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Automated Remediation Plans</span>
              </li>

              <li className="flex items-start gap-3">
                <CheckIcon />
                <span>Audit-Ready Reports</span>
              </li>
            </ul>
          </div>

          {/* Trust badges -- hidden on short viewports to prevent overflow */}
          <div className="mt-8 hidden xl:flex items-center gap-6 opacity-80 text-xs">
            <div className="w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white/70">
              SOC 2
            </div>

            <div className="w-14 h-14 flex items-center justify-center text-center leading-tight px-1 bg-black/10 backdrop-blur-sm border border-white/20 rounded-md text-white/70">
              GDPR Ready
            </div>

            <div className="w-14 h-14 flex items-center justify-center bg-black/5 backdrop-blur-sm border border-white/20 rounded-md text-white/70">
              ISO
            </div>

            <div className="w-14 h-14 flex items-center justify-center bg-black/15 backdrop-blur-sm border border-white/20 rounded-md text-white/70">
              HIPAA
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL -- independently scrollable so content is always reachable */}
      <section className="flex-1 lg:w-2/5 relative flex items-start justify-center overflow-y-auto bg-gradient-to-br from-[#fafafa] via-[#ffffff] to-[#e9ddff] p-6 sm:p-8 lg:p-10">
        {/* gradient glow background */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#6d18ff] rounded-full blur-[120px] opacity-30" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#8f4dff] rounded-full blur-[120px] opacity-30" />
        <div className="relative w-full max-w-md my-auto">
          <AuthRouteTransition>{children}</AuthRouteTransition>
        </div>
      </section>
    </main>
  );
}
