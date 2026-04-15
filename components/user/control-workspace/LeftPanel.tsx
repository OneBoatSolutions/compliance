"use client";

import { CheckCircle, AlertTriangle, XCircle, MinusCircle } from "lucide-react";

export default function LeftPanel({
  status,
  setStatus,
  comments,
  setComments,
  control,
}: any) {
  const options = [
    {
      label: "Compliant",
      desc: "Full adherence verified",
      icon: <CheckCircle className="text-green-500" size={18} />,
    },
    {
      label: "Partially Compliant",
      desc: "Gaps identified in implementation",
      icon: <AlertTriangle className="text-yellow-500" size={18} />,
    },
    {
      label: "Not Compliant",
      desc: "Critical gaps or no evidence",
      icon: <XCircle className="text-red-500" size={18} />,
    },
    {
      label: "Not Applicable",
      desc: "Outside of assessment scope",
      icon: <MinusCircle className="text-gray-400" size={18} />,
    },
  ];

  return (



<div className="bg-card border rounded-xl p-5 space-y-6">

  {/* 🔹 1. HEADER (FULL WIDTH) */}
  <div>
    <p className="text-xs text-muted-foreground mb-1">
      {control?.id}
    </p>

    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        {control?.title}
      </h2>

      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
        HIGH SEVERITY
      </span>
    </div>

    <p className="text-sm text-muted-foreground mt-2">
      {control?.description}
    </p>
  </div>

  {/* 🔹 2. STATUS GRID */}
  <div>
    <p className="text-sm font-medium mb-3">Compliance Status</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((item, i) => {
        const isActive = status === item.label;

        return (
          <div
            key={i}
            onClick={() => setStatus(item.label)}
            className={`cursor-pointer border rounded-lg p-4 transition
              ${
                isActive
                  ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                  : "border-muted hover:border-primary/40"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              {item.icon}
              {isActive && <span className="text-primary text-xs">✔</span>}
            </div>

            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">
              {item.desc}
            </p>
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
        w-full rounded-md p-3 text-sm bg-background transition
        ${!comments ? "border border-red-400" : "border border-muted"}
        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30
      `}

    />
    <p className="text-xs text-muted-foreground text-right mt-1">
    {comments.length}/1000
  </p>
  </div>

</div>
  )
}
