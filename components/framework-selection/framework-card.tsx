"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import ConfidenceDonut from "@/components/framework-selection/ConfidenceDonut";
import {
  frameworkIcons,
  categoryStyles,
  categoryBadgeStyles,
} from "@/components/framework-selection/frameworkIcons";
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
  // ✅ THIS is correct placement
  const Icon = frameworkIcons[framework.name];

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-label={`Select ${framework.name} framework`}
      className={cn(
        ` h-full flex flex-col rounded-3xl border bg-white p-6 transition-all duration-200 transition-all duration-200
hover:-translate-y-1
hover:shadow-lg`,
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
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border",
            categoryBadgeStyles[framework.category],
          )}
        >
          {framework.category}
        </Badge>
      </div>

      {/* ✅ ICON + TITLE (CORRECTLY INSIDE RETURN) */}
      <div className="flex items-start gap-4 mt-3">
        <div
          className={cn(
            " h-11 w-11 rounded-xl flex items-center justify-center bg-purple-50 border border-purple-100 shrink-0 ",
            categoryStyles[framework.category],
          )}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{framework.name}</h3>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        <p className="text-sm text-slate-600 leading-7 mt-4 ">{framework.description}</p>
      </div>

      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={framework.confidence}
        aria-label={`Confidence score ${framework.confidence} percent`}
        className=" mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4"
      >
        <div className=" flex flex-col items-center text-center lg:flex-row lg:justify-between lg:items-center lg:text-left gap-7px ">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Confidence Score</p>

            <p className="text-lg font-semibold text-slate-900">{framework.confidence}%</p>
          </div>

          <div className=" flex justify-center lg:justify-end mt-2 lg:mt-0">
            <ConfidenceDonut value={framework.confidence} />
          </div>
        </div>
      </div>

      {/* Accordion */}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between pt-2">
        <Checkbox
          checked={selected}
          aria-label={`Select ${framework.name}`}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={onToggle}
        />

        <Button
          aria-label={
            selected ? `Remove ${framework.name} framework` : `Select ${framework.name} framework`
          }
          variant={selected ? "default" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="rounded-xl"
        >
          {selected ? "Selected" : "+ Select"}
        </Button>
      </div>
    </div>
  );
}
