"use client";

import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

export default function BottomNavigation() {
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t">
      {/* LEFT: Exit + Save Draft */}
      <div className="flex items-center gap-3">
        {/* Exit */}
        <button
          className="
            flex items-center gap-2 
            px-4 py-2 
            rounded-xl 
            border border-gray-300 
            bg-white 
            text-sm text-gray-700 
            hover:bg-gray-100 
            transition
          "
        >
          <X className="w-4 h-4" />
          Exit
        </button>

        {/* Save Draft */}
        <button
          className="
            flex items-center gap-2 
            px-4 py-2 
            rounded-xl 
            border border-gray-300 
            bg-white 
            text-sm text-gray-700 
            hover:bg-gray-100 
            transition
          "
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
      </div>

      {/* RIGHT: Back + Next */}
      <div className="flex items-center gap-4">
        <button
          className="
            flex items-center gap-2 
            px-4 py-2 
            rounded-xl 
            border border-gray-300 
            bg-white 
            text-sm text-gray-700 
            hover:bg-gray-100 
            transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          className="
            flex items-center gap-2 
            px-5 py-2 
            rounded-xl 
            bg-purple-600 
            text-white 
            hover:bg-purple-700 
            transition
          "
        >
          Next: Review & Create
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
