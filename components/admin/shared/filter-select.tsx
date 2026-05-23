interface FilterSelectProps {
  options: string[];
}

export default function FilterSelect({ options }: FilterSelectProps) {
  return (
    <select className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-500">
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
