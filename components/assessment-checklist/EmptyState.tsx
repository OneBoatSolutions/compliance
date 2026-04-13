"use client";

import { Search } from "lucide-react";

interface Props {
  onClear: () => void;
}

export default function EmptyState({ onClear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {/* ICON */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 mb-4">
        <Search className="text-purple-600 w-8 h-8" />
      </div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-900">No controls match your filters</h2>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-500 mt-2 max-w-md">
        Try adjusting your search or filter criteria to find relevant compliance controls.
      </p>

      {/* ACTION */}
      <button
        onClick={onClear}
        className="mt-6 px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-sm"
      >
        Clear all filters
      </button>

      {/* OPTIONAL HELPER TEXT */}
      <p className="text-xs text-gray-400 mt-3">
        Tip: Remove severity or status filters to broaden results
      </p>
    </div>
  );
}
