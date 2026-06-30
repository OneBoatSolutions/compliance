"use client";

import { useState } from "react";
import { Status } from "@/app/(user)/assessments/[id]/checklist/types";
import { CheckCircle2, AlertCircle, XCircle, Circle, ChevronDown } from "lucide-react";

interface Props {
  status: Status;
  onChange?: (value: Status) => void;
  disabled?: boolean;
}

const statusConfig = {
  COMPLIANT: {
    label: "Compliant",
    color: "text-green-700",
    bg: "bg-green-50",
    icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
  },
  PARTIALLY_COMPLIANT: {
    label: "Partially compliant",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  },
  NOT_COMPLIANT: {
    label: "Non-compliant",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: <XCircle className="w-4 h-4 text-red-500" />,
  },
  NOT_APPLICABLE: {
    label: "Not applicable",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: <Circle className="w-4 h-4 text-blue-500" />,
  },
  NOT_STARTED: {
    label: "Not started",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: <Circle className="w-4 h-4 text-gray-400" />,
  },
};

export default function StatusDropdown({ status, onChange, disabled = false }: Props) {
  const [open, setOpen] = useState(false);

  const statuses = Object.keys(statusConfig) as Status[];
  const current = statusConfig[status];

  return (
    <div className="relative inline-block text-left">
      {/* BUTTON */}
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Status: ${current.label}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          e.stopPropagation();

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        disabled={disabled}
        className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200
hover:shadow-sm
hover:scale-105 active:scale-95 focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-purple-500
  focus-visible:ring-offset-2 ${current.bg} ${current.color}`}
      >
        {current.icon}
        {current.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow z-50 origin-top-right
animate-in
fade-in
zoom-in-95
duration-150  "
        >
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange?.(s);
                setOpen(false);
              }}
              disabled={disabled}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-purple-500
  focus-visible:ring-offset-2"
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
