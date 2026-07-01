"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  return (
    <div className="relative w-full">
      {/* Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      {/* Input */}
      <input
        aria-label="Search compliance frameworks"
        aria-describedby="framework-search-help"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search frameworks (e.g. SOC 2, GDPR, ISO 27001...)"
        className="
          w-full pl-10 pr-4 py-3
          border border-gray-300
          rounded-xl
          bg-white
          text-sm
          shadow-sm
          outline-none
          transition-all
          
          placeholder:text-gray-400
          
          hover:border-gray-400
          
          focus:ring-2 focus:ring-purple-500
          focus:border-purple-500
          focus:shadow-md
        "
      />
      <p id="framework-search-help" className="sr-only">
        Search by framework name such as GDPR, ISO 27001 or SOC 2.
      </p>
    </div>
  );
}
