"use client";

import { Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  frameworks: string[];
  setFrameworks: React.Dispatch<React.SetStateAction<string[]>>;

  status: string[];
  setStatus: React.Dispatch<React.SetStateAction<string[]>>;

  severity: string[];
  setSeverity: React.Dispatch<React.SetStateAction<string[]>>;

  sort: string;
  setSort: (v: string) => void;
}

export default function FilterBar({
  search,
  setSearch,
  frameworks,
  setFrameworks,
  status,
  setStatus,
  severity,
  setSeverity,
  sort,
  setSort,
}: Props) {
  const [open, setOpen] = useState<string | null>(null);

  // OPTIONS
  const frameworkOptions = ["HIPAA", "GDPR", "PCI-DSS"];
  const statusOptions = ["COMPLIANT", "PARTIAL", "NON_COMPLIANT", "NOT_STARTED"];
  const severityOptions = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

  // TOGGLE HANDLER
  const toggle = (value: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

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
            {frameworkOptions.map((fw) => (
              <label key={fw} className="flex items-center gap-2 p-1 text-sm">
                <input
                  type="checkbox"
                  checked={frameworks.includes(fw)}
                  onChange={() => toggle(fw, setFrameworks)}
                />
                {fw}
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
                      : s === "PARTIAL"
                        ? "text-yellow-600"
                        : s === "NON_COMPLIANT"
                          ? "text-red-600"
                          : "text-gray-600"
                  }
                >
                  {s}
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
        onChange={(e) => setSort(e.target.value)}
        className="px-3 py-2 rounded-lg border bg-white shadow-sm"
      >
        <option value="severity">Severity ↓</option>
        <option value="status">Status</option>
        <option value="id">Control ID</option>
        <option value="updated">Last Updated</option>
      </select>

      {/*  FILTER PILLS */}
      <div className="flex gap-2 ml-auto flex-wrap">
        {[...frameworks, ...status, ...severity].map((item) => (
          <span
            key={item}
            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
          >
            {item}
            <button
              onClick={() => {
                setFrameworks(frameworks.filter((f) => f !== item));
                setStatus(status.filter((s) => s !== item));
                setSeverity(severity.filter((s) => s !== item));
              }}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {(frameworks.length || status.length || severity.length) && (
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
