interface FrameworkListStatsProps {
  total: number;
  published: number;
  draft: number;
}

export function FrameworkListStats({ total, published, draft }: FrameworkListStatsProps) {
  return (
    <section aria-label="Framework statistics">
      <dl className="grid w-full max-w-xl grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <dt className="text-sm font-medium uppercase tracking-wide text-white/70">Total</dt>
          <dd className="mt-3 text-4xl font-bold">{total}</dd>
          <dd className="mt-2 text-sm text-white/70">Matching frameworks</dd>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <dt className="text-sm font-medium uppercase tracking-wide text-white/70">Published</dt>
          <dd className="mt-3 text-4xl font-bold text-[#86efac]">{published}</dd>
          <dd className="mt-2 text-sm text-white/70">Production ready</dd>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <dt className="text-sm font-medium uppercase tracking-wide text-white/70">Drafts</dt>
          <dd className="mt-3 text-4xl font-bold text-[#fde68a]">{draft}</dd>
          <dd className="mt-2 text-sm text-white/70">In progress</dd>
        </div>
      </dl>
    </section>
  );
}
