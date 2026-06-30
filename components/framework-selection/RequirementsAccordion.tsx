"use client";

import { useState } from "react";

interface Props {
  why: string;
  requirements: string[];
}

export default function RequirementsAccordion({ why, requirements }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2" id={`requirements-${why.slice(0, 20)}`}>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-purple-600 font-medium"
        aria-expanded={open}
        aria-controls={`requirements-${why.slice(0, 20)}`}
      >
        Why this applies {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="mt-2 space-y-2 text-sm text-gray-600">
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
