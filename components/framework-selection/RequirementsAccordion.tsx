"use client";

import { useId, useState } from "react";

interface Props {
  why: string;
  requirements: string[];
}

export default function RequirementsAccordion({ why, requirements }: Props) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-purple-600 font-medium"
        aria-expanded={open}
        aria-controls={contentId}
      >
        Why this applies {open ? "▲" : "▼"}
      </button>

      {open && (
        <div id={contentId} className="mt-2 space-y-2 text-sm text-gray-600">
          {/* Why */}
          <p>{why}</p>

          {/* Requirements */}
          <ul className="space-y-1">
            {requirements.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
