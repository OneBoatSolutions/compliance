"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

interface CoverProps extends React.HTMLAttributes<HTMLElement> {
  appName: string;
  frameworks: string[];
  generatedAt: string;
  preparedFor: string;
  version: string;
}

export function CoverSkeleton() {
  return (
    <section
      className="relative w-full min-h-[90vh] flex flex-col bg-white overflow-hidden py-8"
      aria-labelledby="report-cover-title"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-4 border-b">
        <SkeletonBlock className="h-4 w-52" />

        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-24 rounded-md" />
          <SkeletonBlock className="h-9 w-36 rounded-md" />
          <SkeletonBlock className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 space-y-6">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-6 w-6 rounded-full" />
          <SkeletonBlock className="h-5 w-24" />
        </div>

        <SkeletonBlock className="h-12 w-[420px]" />

        <SkeletonBlock className="h-6 w-64" />

        <div className="flex gap-2">
          <SkeletonBlock className="h-7 w-20 rounded-full" />
          <SkeletonBlock className="h-7 w-24 rounded-full" />
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-10 space-y-2">
        <SkeletonBlock className="h-4 w-44 mx-auto" />
        <SkeletonBlock className="h-4 w-36 mx-auto" />
        <SkeletonBlock className="h-4 w-24 mx-auto" />
      </div>
    </section>
  );
}

export default function Cover({
  appName,
  frameworks,
  generatedAt,
  preparedFor,
  version,
  className,
  ...props
}: CoverProps) {
  const formattedDate = new Date(generatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      {...props}
      className={`relative w-full min-h-[90vh] flex flex-col overflow-hidden ${className || ""}`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#4C1D95] to-[#1E1B4B]" />

        {/* Dot Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Large Decorative Circles */}
        <div className="absolute -right-40 top-1/3 h-[600px] w-[600px] rounded-full bg-purple-500/30 blur-3xl" />

        <div className="absolute -left-20 bottom-[-150px] h-[450px] w-[450px] rounded-full bg-indigo-900/40 blur-2xl" />

        {/* Watermark Shield */}
        <div className="absolute right-24 top-32 opacity-10">
          <ShieldCheck className="h-[300px] w-[300px] text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col px-14 py-16 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="h-10 w-10" />
          <span className="text-3xl font-bold">Cipherion</span>
        </div>

        {/* Content Area */}
        <div className="mt-24 max-w-3xl ">
          <p className="text-3xl font-light tracking-[0.15em] uppercase text-white/80">
            Compliance
          </p>

          <h1
            id="report-cover-title"
            className="
    text-7xl
    font-bold
    leading-none
    bg-gradient-to-r
    from-white
    via-purple-100
    to-white
    bg-clip-text
    text-transparent
    drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]
  "
          >
            Readiness
            <br />
            Report
          </h1>

          <div className="mt-8 h-1 w-20 rounded-full bg-purple-300" />

          {/* App Name */}
          <h2 className="mt-8 text-3xl font-light uppercase">{appName}</h2>

          {/* Frameworks */}
          <div className="mt-6 flex flex-wrap gap-3">
            {frameworks.map((fw) => (
              <span
                key={fw}
                className="rounded-full bg-white/20 px-4 py-2 mb-32 text-sm backdrop-blur-sm"
              >
                {fw}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-white/20 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90">
              <span>
                <span className="uppercase tracking-[0.25em] text-purple-200 text-xs">
                  Prepared For
                </span>
                <span className="ml-2 text-base font-medium text-white">{preparedFor}</span>
              </span>

              <span className="text-white/40">|</span>

              <span>
                <span className="uppercase tracking-[0.25em] text-purple-200 text-xs">
                  Generated On
                </span>
                <span className="ml-2 text-base font-medium text-white">{formattedDate}</span>
              </span>

              <span className="text-white/40">|</span>

              <span>
                <span className="uppercase tracking-[0.25em] text-purple-200 text-xs">Version</span>
                <span className="ml-2 text-base font-medium text-white">{version}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
