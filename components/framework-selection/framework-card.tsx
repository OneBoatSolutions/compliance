"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import ConfidenceDonut from "@/components/framework-selection/ConfidenceDonut";
import RequirementsAccordion from "./RequirementsAccordion";
import { frameworkIcons, categoryStyles } from "@/components/framework-selection/frameworkIcons";

interface Framework {
  name: string;
  description: string;
  category: string;
  confidence: number;
  requirements: string[];
  why: string;
  recommended?: boolean;
}

interface Props {
  framework: Framework;
  selected: boolean;
  onToggle: () => void;
}

export default function FrameworkCard({ framework, selected, onToggle }: Props) {
  const getConfidenceColor = () => {
    if (framework.confidence > 80) {
      return "bg-green-500";
    }
    if (framework.confidence > 50) {
      return "bg-yellow-500";
    }
    return "bg-red-500";
  };

  // ✅ THIS is correct placement
  const Icon = frameworkIcons[framework.name];

  return (
    <div
      className={cn(
        "relative p-5  pt-7 rounded-2xl border bg-white transition-all duration-200",
        selected ? "border-purple-500 shadow-md" : "border-gray-200 hover:shadow-sm",
      )}
    >
      {/* Recommended Tag */}
      {framework.recommended && (
        <div className="absolute top-1.5 right-1.5 text-xs px-2 py-4 rounded-full bg-purple-100 text-purple-600 font-medium z-10">
          RECOMMENDED
        </div>
      )}

      {/* Top Section */}
      <div className="flex justify-between items-start mt-1">
        <Badge variant="secondary">{framework.category}</Badge>
      </div>

      {/* ✅ ICON + TITLE (CORRECTLY INSIDE RETURN) */}
      <div className="flex items-center gap-3 mt-1">
        <div className={cn("p-2 rounded-lg border", categoryStyles[framework.category])}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-900">{framework.name}</h3>
          <p className="text-xs text-gray-400">{framework.category}</p>
        </div>
        <div className="flex flex-col items-center ml-auto pr-1 transition-transform group-hover:scale-105">
          <ConfidenceDonut value={framework.confidence} />
          <p className="text-[10px] text-gray-400 tracking-wide">Confidence</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-2">{framework.description}</p>

      {/* Accordion */}
      <div className="mt-3">
        <RequirementsAccordion why={framework.why} requirements={framework.requirements} />
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <Checkbox checked={selected} onCheckedChange={onToggle} />

        <Button
          variant={selected ? "default" : "outline"}
          className="rounded-xl"
          onClick={onToggle}
        >
          {selected ? "Selected" : "+ Select"}
        </Button>
      </div>
    </div>
  );
}
