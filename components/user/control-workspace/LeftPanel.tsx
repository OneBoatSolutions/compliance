"use client";

import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react";

type AssessmentItemStatus =
  | "NOT_STARTED"
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NOT_COMPLIANT"
  | "NOT_APPLICABLE";

export default function LeftPanel({
  status,
  setStatus,
  comments,
  setComments,
  control,
}: {
  status: AssessmentItemStatus;
  setStatus: (s: AssessmentItemStatus) => void;
  comments: string;
  setComments: (c: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
}) {
  const options = [
    {
      value: "COMPLIANT" as const,
      label: "Compliant",
      desc: "Full adherence verified",
      icon: <CheckCircle className="text-green-500" size={18} />,
    },
    {
      value: "PARTIALLY_COMPLIANT" as const,
      label: "Partially Compliant",
      desc: "Gaps identified in implementation",
      icon: <AlertTriangle className="text-yellow-500" size={18} />,
    },
    {
      value: "NOT_COMPLIANT" as const,
      label: "Not Compliant",
      desc: "Critical gaps or no evidence",
      icon: <XCircle className="text-red-500" size={18} />,
    },
    {
      value: "NOT_APPLICABLE" as const,
      label: "Not Applicable",
      desc: "Outside of assessment scope",
      icon: <MinusCircle className="text-gray-400" size={18} />,
    },
  ];

  return (
    <div className="bg-white shadow-md border border-slate-200 rounded-2xl p-6 space-y-8">
      {/* 🔹 1. HEADER (FULL WIDTH) */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">{control?.code || control?.id}</p>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{control?.title}</h2>

          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              control?.severity === "HIGH" || control?.severity === "CRITICAL"
                ? "bg-red-50 text-red-600 ring-1 ring-red-500/20"
                : control?.severity === "MEDIUM"
                  ? "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20"
                  : "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20"
            }`}
          >
            {control?.severity || "MEDIUM"} SEVERITY
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-2">{control?.description}</p>
      </div>

      {/* 🔹 2. STATUS GRID */}
      <div>
        <p className="text-sm font-medium mb-3">Compliance Status</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((item, i) => {
            const isActive = status === item.value;

            return (
              <div
                key={i}
                onClick={() => setStatus(item.value)}
                className={`cursor-pointer border rounded-xl p-4 transition-all duration-200
              ${
                isActive
                  ? "border-purple-600 ring-1 ring-purple-600 bg-purple-50/50 shadow-sm"
                  : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
              }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {item.icon}
                  {isActive && <span className="text-primary text-xs">✔</span>}
                </div>

                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 3. TEXTAREA (FULL WIDTH FIX) */}
      <div className="w-full">
        <p className="text-sm font-medium mb-2">Compliance Gap Details</p>

        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Describe any compliance gaps..."
          className={`
        w-full rounded-xl p-4 text-sm bg-slate-50 transition-all duration-200
        ${!comments ? "border border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"}
        focus:outline-none focus:ring-4 focus:bg-white
      `}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">{comments.length}/1000</p>
      </div>
    </div>
  );
}
