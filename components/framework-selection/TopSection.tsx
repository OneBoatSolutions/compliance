"use client";

import { ShieldCheck, X } from "lucide-react";

export default function TopSection() {
  return (
    <div className="flex justify-between items-start">
      {/* LEFT: Icon + Title */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Select your compliance frameworks
          </h1>

          <p className="text-gray-500 mt-1 text-sm max-w-xl">
            Choose the standards you want to be assessed against. You can add more later.
          </p>
        </div>
      </div>
    </div>
  );
}
