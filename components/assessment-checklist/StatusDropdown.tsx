"use client";

import { useState } from "react";
import { Status } from "@/app/(user)/assessments/[id]/checklist/types";
import { CheckCircle2, AlertCircle, XCircle, Circle, ChevronDown } from "lucide-react";

interface Props {
  status: Status;
  onChange?: (value: Status) => void;
}

const statusConfig = {
  COMPLIANT: {
    label: "Compliant",
    color: "text-green-700",
    bg: "bg-green-50",
    icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  },
  PARTIAL: {
    label: "Partial",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  },
  NON_COMPLIANT: {
    label: "Non-compliant",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: <XCircle className="w-4 h-4 text-red-500" />,
  },
  NOT_STARTED: {
    label: "Not started",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: <Circle className="w-4 h-4 text-gray-400" />,
  },
};

export default function StatusDropdown({ status, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const statuses = Object.keys(statusConfig) as Status[];
  const current = statusConfig[status];

  return (
    <div className="relative inline-block text-left">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-semibold ${current.bg} ${current.color}`}
      >
        {current.icon}
        {current.label}
        <ChevronDown size={14} />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow z-50">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange?.(s);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
            >
              {statusConfig[s].icon}
              <span className={statusConfig[s].color}>{statusConfig[s].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
