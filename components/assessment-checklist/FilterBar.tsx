"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  type ChecklistSort,
  type FrameworkFilterOption,
  type Severity,
  type Status,
} from "@/app/(user)/assessments/[id]/checklist/types";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  frameworks: string[];
  setFrameworks: React.Dispatch<React.SetStateAction<string[]>>;
  frameworkOptions: FrameworkFilterOption[];

  status: Status[];
  setStatus: React.Dispatch<React.SetStateAction<Status[]>>;

  severity: Severity[];
  setSeverity: React.Dispatch<React.SetStateAction<Severity[]>>;

  sort: ChecklistSort;
  setSort: (v: ChecklistSort) => void;
}

function statusLabel(status: Status): string {
  if (status === "NOT_STARTED") {
    return "Not started";
  }

  if (status === "PARTIALLY_COMPLIANT") {
    return "Partially compliant";
  }

  if (status === "NOT_COMPLIANT") {
    return "Non-compliant";
  }

  if (status === "NOT_APPLICABLE") {
    return "Not applicable";
  }

  return "Compliant";
}

export default function FilterBar({
  search,
  setSearch,
  frameworks,
  setFrameworks,
  frameworkOptions,
  status,
  setStatus,
  severity,
  setSeverity,
  sort,
  setSort,
}: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const statusOptions: Status[] = [
    "COMPLIANT",
    "PARTIALLY_COMPLIANT",
    "NOT_COMPLIANT",
    "NOT_STARTED",
    "NOT_APPLICABLE",
  ];
  const severityOptions: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const toggle = <T extends string>(
    value: T,
    setList: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    setList((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const selectedTags = [
    ...frameworks.map((framework) => {
      const option = frameworkOptions.find((item) => item.id === framework);
      return {
        type: "framework" as const,
        value: framework,
        label: option ? option.code : framework,
      };
    }),
    ...status.map((item) => ({
      type: "status" as const,
      value: item,
      label: statusLabel(item),
    })),
    ...severity.map((item) => ({
      type: "severity" as const,
      value: item,
      label: item,
    })),
  ];

  return (
    <div className="bg-slate-100 p-4 rounded-xl flex flex-wrap gap-3 items-center">
      {/* SEARCH */}
      <div className="relative w-full">
        <input
          className="w-full pl-10 pr-8 py-2 bg-white rounded-lg w-[300px] border shadow-sm "
          placeholder="Search controls by ID or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Search className="absolute left-3 top-2 text-gray-400" size={20} />

        {/* CLEAR BUTTON */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* FRAMEWORK FILTER */}
      <div className="relative ">
        <button
          onClick={() => setOpen(open === "framework" ? null : "framework")}
          className="px-3 py-2 border rounded-lg flex items-center gap-2 bg-white shadow-sm"
        >
          Framework: {frameworks.length || "All"}
          <ChevronDown size={14} />
        </button>

        {open === "framework" && (
          <div className="absolute mt-2 bg-white border rounded-lg shadow p-2 w-48 z-50">
            {frameworkOptions.map((framework) => (
              <label key={framework.id} className="flex items-center gap-2 p-1 text-sm">
                <input
                  type="checkbox"
                  checked={frameworks.includes(framework.id)}
                  onChange={() => toggle(framework.id, setFrameworks)}
                />
                <span>{framework.code}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* STATUS FILTER */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "status" ? null : "status")}
          className="px-3 py-2 border rounded-lg flex items-center gap-2 bg-white shadow-sm"
        >
          Status: {status.length || "All"}
          <ChevronDown size={14} />
        </button>

        {open === "status" && (
          <div className="absolute mt-2 bg-white border rounded-lg shadow p-2 w-52 z-50">
            {statusOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 p-1 text-sm">
                <input
                  type="checkbox"
                  checked={status.includes(s)}
                  onChange={() => toggle(s, setStatus)}
                />
                <span
                  className={
                    s === "COMPLIANT"
                      ? "text-green-600"
                      : s === "PARTIALLY_COMPLIANT"
                        ? "text-yellow-600"
                        : s === "NOT_COMPLIANT"
                          ? "text-red-600"
                          : s === "NOT_APPLICABLE"
                            ? "text-blue-600"
                            : "text-gray-600"
                  }
                >
                  {statusLabel(s)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SEVERITY FILTER */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === "severity" ? null : "severity")}
          className="px-3 py-2 border rounded-lg flex items-center gap-2 bg-white shadow-sm"
        >
          Severity: {severity.length || "All"}
          <ChevronDown size={14} />
        </button>

        {open === "severity" && (
          <div className="absolute mt-2 bg-white border rounded-lg shadow p-2 w-52 z-50">
            {severityOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 p-1 text-sm">
                <input
                  type="checkbox"
                  checked={severity.includes(s)}
                  onChange={() => toggle(s, setSeverity)}
                />
                {s}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SORT */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as ChecklistSort)}
        className="px-3 py-2 rounded-lg border bg-white shadow-sm"
      >
        <option value="severity">Severity ↓</option>
        <option value="status">Status</option>
        <option value="id">Control ID</option>
        <option value="updated">Last Updated</option>
      </select>

      {/*  FILTER PILLS */}
      <div className="flex gap-2 ml-auto flex-wrap">
        {selectedTags.map((tag) => (
          <span
            key={`${tag.type}:${tag.value}`}
            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
          >
            {tag.label}
            <button
              onClick={() => {
                if (tag.type === "framework") {
                  setFrameworks(frameworks.filter((framework) => framework !== tag.value));
                  return;
                }

                if (tag.type === "status") {
                  setStatus(status.filter((item) => item !== tag.value));
                  return;
                }

                setSeverity(severity.filter((item) => item !== tag.value));
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {(frameworks.length > 0 || status.length > 0 || severity.length > 0) && (
          <button
            onClick={() => {
              setFrameworks([]);
              setStatus([]);
              setSeverity([]);
            }}
            className="text-purple-600 text-sm"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
