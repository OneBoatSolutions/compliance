"use client";

//import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Framework {
  name: string;
  controls: number;
  category: string;
}

interface Props {
  selected: Framework[];
  onContinue: () => void;
  loading?: boolean;
}

export default function SidebarSummary({ selected, onContinue, loading }: Props) {
  const totalControls = selected.reduce((sum, f) => sum + (f.controls || 0), 0);

  // simple estimation logic (you can tweak later)
  const estimatedTime = Math.ceil(totalControls / 20); // weeks

  // category color styles
  const categoryColors: Record<string, string> = {
    Security: "bg-blue-100 text-blue-700",
    Privacy: "bg-green-100 text-green-700",
    Industry: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="sticky top-6 p-5 rounded-2xl bg-purple-50 border border-purple-100 h-fit flex flex-col">
      <div className="flex flex-col h-full space-y-8">
        <div>
          <h3 className="font-semibold text-lg text-purple-800 mb-6">Selected Frameworks</h3>
          <ul className="space-y-6" aria-label="Selected frameworks">
            {/* Framework List */}
            <li className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {selected.length === 0 ? (
                <p className="text-sm text-gray-500">No frameworks selected</p>
              ) : (
                selected.map((f, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center gap-3 text-sm px-2 py-1 rounded-md hover:bg-purple-100 transition"
                  >
                    <span
                      className={cn("font-medium truncate min-w-0", categoryColors[f.category])}
                    >
                      {f.name}
                    </span>

                    <span className="text-purple-800 font-semibold shrink-0 whitespace-nowrap">
                      {f.controls} controls
                    </span>
                  </div>
                ))
              )}
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-500">{selected.length} frameworks selected</p>

        {/* Divider */}
        <div className="border-t border-purple-200" />

        <div className="flex flex-wrap gap-2 text-xs">
          {[...new Set(selected.map((f) => f.category))].map((cat, i) => (
            <span key={i} className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              {cat}
            </span>
          ))}
        </div>

        {/* Stats + CTA */}
        <div className="space-y-8">
          {/* Stats */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between font-semibold text-purple-800">
              <span>Total Controls</span>
              <span>{totalControls}</span>
            </div>

            <div className="flex justify-between font-semibold text-purple-800">
              <span>Estimated Time</span>
              <span>{estimatedTime} weeks</span>
            </div>
          </div>

          {/* CTA */}
          <button
            aria-label="Continue to assessment creation"
            onClick={onContinue}
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-semibold transition-all
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
  `}
          >
            {loading ? "Creating Assessment..." : "Continue to Assessment →"}
          </button>
        </div>

        {/* Confidence Legend Card */}
        <div className="mt-2 p-4 rounded-xl bg-white border border-purple-100 space-y-8">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Understanding Confidence Scores
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500" />

              <span className="w-14 text-xs font-medium text-slate-700"> 90%+</span>

              <span className="text-xs text-slate-500"> Very High </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500" />

              <span className="w-14 text-xs font-medium text-slate-700"> 75–89% </span>

              <span className="text-xs text-slate-500"> High </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />

              <span className="w-14 text-xs font-medium text-slate-700"> 60–74% </span>

              <span className="text-xs text-slate-500"> Moderate </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500" />

              <span className="w-14 text-xs font-medium text-slate-700">below 60%</span>

              <span className="text-xs text-slate-500"> Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
