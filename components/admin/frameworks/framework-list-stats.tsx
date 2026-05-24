interface FrameworkListStatsProps {
  total: number;
  published: number;
  draft: number;
}

export function FrameworkListStats({ total, published, draft }: FrameworkListStatsProps) {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-wide text-white/70">Total</p>
        <h2 className="mt-3 text-4xl font-bold">{total}</h2>
        <p className="mt-2 text-sm text-white/70">Matching frameworks</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-wide text-white/70">Published</p>
        <h2 className="mt-3 text-4xl font-bold text-[#86efac]">{published}</h2>
        <p className="mt-2 text-sm text-white/70">Production ready</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-wide text-white/70">Drafts</p>
        <h2 className="mt-3 text-4xl font-bold text-[#fde68a]">{draft}</h2>
        <p className="mt-2 text-sm text-white/70">In progress</p>
      </div>
    </div>
  );
}
