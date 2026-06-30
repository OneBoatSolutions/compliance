"use client";

interface Props {
  active: string;
  setActive: (val: string) => void;
}

const options = ["All", "High", "Medium", "Low"];

export default function ConfidenceFilter({ active, setActive }: Props) {
  return (
    <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Confidence filters">
      {options.map((opt) => (
        <button
          role="tab"
          aria-selected={active === opt}
          aria-label={`${opt} confidence`}
          key={opt}
          onClick={() => setActive(opt)}
          className={`px-3 py-1 rounded-full text-sm transition ${
            active === opt
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
