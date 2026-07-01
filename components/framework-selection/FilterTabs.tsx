"use client";

interface Props {
  active: string;
  setActive: (val: string) => void;
}

const tabs = ["All", "Security", "Privacy", "Industry"];

export default function FilterTabs({ active, setActive }: Props) {
  return (
    <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Framework category filters">
      {tabs.map((tab) => (
        <button
          role="tab"
          aria-selected={active === tab}
          aria-label={`Show ${tab} frameworks`}
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-2.5 rounded-full text-sm transition ${
            active === tab ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
