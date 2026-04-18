"use client";

import { useState, useRef, useEffect } from "react";

interface MoreActionsDropdownProps {
  onExportCsv?: () => void | Promise<void>;
  onDuplicateAssessment?: () => void | Promise<void>;
  onDeleteAssessment?: () => void | Promise<void>;
  disabled?: boolean;
}

export default function MoreActionsDropdown({
  onExportCsv,
  onDuplicateAssessment,
  onDeleteAssessment,
  disabled = false,
}: MoreActionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleAction = async (action?: () => void | Promise<void>) => {
    if (!action || disabled) {
      setOpen(false);
      return;
    }

    await action();
    setOpen(false);
  };

  // CLOSE on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON (3 dots) */}
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        ⋮
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              void handleAction(onExportCsv);
            }}
            disabled={disabled}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Export as CSV
          </button>

          <button
            onClick={() => {
              void handleAction(onDuplicateAssessment);
            }}
            disabled={disabled}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Duplicate assessment
          </button>

          <button
            onClick={() => {
              void handleAction(onDeleteAssessment);
            }}
            disabled={disabled}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Delete assessment
          </button>
        </div>
      )}
    </div>
  );
}
