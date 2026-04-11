"use client";

import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface BottomNavigationProps {
  onNext: () => void | Promise<void>;
  loading?: boolean;
}

export default function BottomNavigation({ onNext, loading = false }: BottomNavigationProps) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center mt-12 pt-6 border-t">
      {/* LEFT: Exit + Save Draft */}
      <div className="flex items-center gap-3">
        {/* Exit */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
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
          type="button"
          onClick={() => router.back()}
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
          type="button"
          onClick={onNext}
          disabled={loading}
          className={`
            flex items-center gap-2
            px-5 py-2
            rounded-xl
            text-white
            transition
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
          `}
        >
          {loading ? "Creating Assessment..." : "Next: Review & Create"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
