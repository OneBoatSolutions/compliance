"use client";

import { GraduationCap } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 animate-fadeIn">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="relative">
          <GraduationCap className="w-30 h-30 text-purple-600 animate-pulse drop shadow:md " />
        </div>

        {/* Text */}
        <p className="text-gray-700 text-sm tracking-wide">Analyzing your Requirements...</p>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-purple-600 rounded-full animate-loadingBar" />
        </div>

        {/* Footer Text */}
        <p className="text-[11.5px] tracking-[0.2em] text-gray-400">
          CIPHERION INTELLIGENCE ENGINES
        </p>
      </div>
    </div>
  );
}
