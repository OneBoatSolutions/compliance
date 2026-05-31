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
        {/* Heading + List */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-purple-800">Selected Frameworks</h3>

          {/* Framework List */}
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {selected.length === 0 ? (
              <p className="text-sm text-gray-500">No frameworks selected</p>
            ) : (
              selected.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-3 text-sm px-2 py-1 rounded-md hover:bg-purple-100 transition"
                >
                  <span className={cn("font-medium truncate min-w-0", categoryColors[f.category])}>
                    {f.name}
                  </span>

                  <span className="text-purple-800 font-semibold shrink-0 whitespace-nowrap">
                    {f.controls} controls
                  </span>
                </div>
              ))
            )}
          </div>
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
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="font-medium">90%+</span>
              <span className="text-gray-500">Very High Dependability</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-medium">75–89%</span>
              <span className="text-gray-500">High Dependability</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="font-medium">60–74%</span>
              <span className="text-gray-500">Moderate Fit</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="font-medium">&lt;60%</span>
              <span className="text-gray-500">Low Relevance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
