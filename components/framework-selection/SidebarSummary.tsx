"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Framework {
  name: string;
  controls: number;
  category: string;
}

interface Props {
  selected: Framework[];
}

export default function SidebarSummary({ selected }: Props) {
  const totalControls = selected.reduce((sum, f) => sum + (f.controls || 0), 0);

  // 👉 simple estimation logic (you can tweak later)
  const estimatedTime = Math.ceil(totalControls / 20); // weeks

  // category color styles
  const categoryColors: Record<string, string> = {
    Security: "bg-blue-100 text-blue-700",
    Privacy: "bg-green-100 text-green-700",
    Industry: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="sticky top-6 p-5 rounded-2xl bg-purple-50 border border-purple-100 h-fit">
      {/* Heading */}
      <h3 className="font-semibold text-lg mb-4 text-purple-800">Selected Frameworks</h3>

      {/* Framework List */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {selected.length === 0 ? (
          <p className="text-sm text-gray-500">No frameworks selected</p>
        ) : (
          selected.map((f, i) => (
            <div key={i} className="flex justify-between items-center text-sm px-2 py-1 rounded-md">
              {/* Left: Name with category color */}
              <span className={cn("font-medium", categoryColors[f.category])}>{f.name}</span>

              {/* Right: Controls */}
              <span className="text-purple-800 font-semibold">{f.controls} controls</span>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t my-4 border-purple-200" />

      {/* Stats */}
      <div className="space-y-2 text-sm">
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
      <Button className="w-full mt-5 rounded-xl">Continue to Assessment →</Button>
    </div>
  );
}
