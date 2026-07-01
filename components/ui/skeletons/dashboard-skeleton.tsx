import SkeletonBlock from "./skeleton-block";

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-24">
        {/* Hero */}
        <section className="mb-8 rounded-2xl border border-[#6d18ff]/10 bg-white p-8">
          <SkeletonBlock className="h-10 w-64 rounded-lg" />
          <SkeletonBlock className="mt-4 h-4 w-full max-w-2xl" />
          <SkeletonBlock className="mt-2 h-4 w-[80%]" />
        </section>

        {/* Metric Cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((unusedItem, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="mt-4 h-8 w-16" />
                  <SkeletonBlock className="mt-4 h-6 w-28 rounded-full" />
                </div>

                <SkeletonBlock className="h-11 w-11 rounded-xl" />
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-7">
            {/* Assessments */}
            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <SkeletonBlock className="h-6 w-52" />
                  <SkeletonBlock className="mt-2 h-4 w-72" />
                </div>

                <SkeletonBlock className="h-8 w-24 rounded-full" />
              </div>

              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((unusedItem, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/70 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <SkeletonBlock className="h-5 w-48" />

                        <div className="mt-3 flex gap-2">
                          <SkeletonBlock className="h-6 w-20 rounded-full" />
                          <SkeletonBlock className="h-6 w-24 rounded-full" />
                          <SkeletonBlock className="h-6 w-24 rounded-full" />
                        </div>

                        <SkeletonBlock className="mt-4 h-4 w-40" />
                      </div>

                      <SkeletonBlock className="h-20 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Activity */}
            <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="mt-2 h-4 w-60" />

              <div className="mt-8 space-y-6">
                {Array.from({ length: 4 }).map((unusedItem, i) => (
                  <div key={i} className="flex gap-4">
                    <SkeletonBlock className="h-10 w-10 rounded-full" />

                    <div className="flex-1">
                      <SkeletonBlock className="h-4 w-56" />
                      <SkeletonBlock className="mt-2 h-3 w-72" />
                      <SkeletonBlock className="mt-2 h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* RIGHT */}
          <aside className="space-y-4 lg:col-span-3">
            {/* Quick Actions */}
            <article className="rounded-xl bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="mt-3 h-6 w-44" />
              <SkeletonBlock className="mt-3 h-4 w-full" />
              <SkeletonBlock className="mt-2 h-4 w-[85%]" />

              <div className="mt-6 space-y-3">
                <SkeletonBlock className="h-10 w-full rounded-lg" />
                <SkeletonBlock className="h-10 w-full rounded-lg" />
                <SkeletonBlock className="h-10 w-full rounded-lg" />
              </div>
            </article>

            {/* Donut */}
            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-4 w-40" />

              <div className="mt-6 flex justify-center">
                <SkeletonBlock className="h-40 w-40 rounded-full" />
              </div>
            </article>

            {/* Gaps */}
            <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-4 w-32" />

              <div className="mt-6 flex items-center gap-4">
                <SkeletonBlock className="h-12 w-12 rounded-full" />

                <div>
                  <SkeletonBlock className="h-6 w-14" />
                  <SkeletonBlock className="mt-2 h-4 w-40" />
                </div>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}
