"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface BottomNavigationProps {
  onNext: () => void | Promise<void>;
  loading?: boolean;
}

export default function BottomNavigation({ onNext, loading = false }: BottomNavigationProps) {
  const router = useRouter();

  return (
    <div className="mt-12 pt-6 border-t">
      {/* LEFT: Exit + Save Draft */}
      <div className="grid grid-cols-2 gap-3 md:flex md:justify-between md:items-center">
        {/* Exit */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="
      flex items-center justify-center gap-2
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

        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="
      flex items-center justify-center gap-2
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

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className={`
      flex items-center justify-center gap-2
      px-5 py-2
      rounded-xl
      text-white
      text-sm
      transition
      ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
    `}
        >
          {loading ? "Creating..." : "Next: Review & Create"}
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
