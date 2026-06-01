import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";
export default function DashboardSkeleton() {
  return (
    <section className="relative min-h-screen space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <SkeletonBlock className="h-8 w-64 rounded-lg" />
            <SkeletonBlock className="mt-3 h-4 w-96" />
          </div>

          <div className="flex gap-3">
            <SkeletonBlock className="h-10 w-28 rounded-lg" />
            <SkeletonBlock className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* LEFT CONTENT */}
        <div className="space-y-6 lg:col-span-3">
          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((unusedItem, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SkeletonBlock className="h-3 w-24" />
                    <SkeletonBlock className="mt-4 h-8 w-20" />
                    <SkeletonBlock className="mt-4 h-4 w-28" />
                  </div>

                  <SkeletonBlock className="h-12 w-12 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <SkeletonBlock className="h-6 w-44" />
                  <SkeletonBlock className="mt-2 h-4 w-56" />
                </div>

                <SkeletonBlock className="h-10 w-10 rounded-lg" />
              </div>

              <div className="mt-8 space-y-6">
                {Array.from({ length: 5 }).map((unusedItem, i) => (
                  <div key={i} className="flex gap-4">
                    <SkeletonBlock className="h-10 w-10 rounded-full" />

                    <div className="flex-1">
                      <SkeletonBlock className="h-4 w-48" />
                      <SkeletonBlock className="mt-2 h-3 w-full max-w-[260px]" />
                      <SkeletonBlock className="mt-2 h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div>
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="mt-2 h-4 w-52" />
              </div>

              <div className="mt-8 flex items-end justify-between gap-3 h-[240px]">
                {Array.from({ length: 7 }).map((unusedItem, i) => (
                  <SkeletonBlock
                    key={i}
                    className={`w-full rounded-t-xl ${
                      ["h-[40%]", "h-[60%]", "h-[75%]", "h-[50%]", "h-[90%]", "h-[65%]", "h-[80%]"][
                        i
                      ]
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <SkeletonBlock className="h-6 w-52" />
                <SkeletonBlock className="mt-2 h-4 w-72" />
              </div>

              <SkeletonBlock className="h-10 w-32 rounded-lg" />
            </div>

            <div className="mt-8 space-y-4">
              {Array.from({ length: 5 }).map((unusedItem, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 items-center gap-4 border-b border-slate-100 pb-4"
                >
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-8 w-full rounded-full" />
                  <SkeletonBlock className="h-8 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="relative z-10 space-y-6">
          {/* Calendar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <SkeletonBlock className="h-6 w-36" />

            <div className="mt-6 grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((unusedItem, i) => (
                <SkeletonBlock key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <SkeletonBlock className="h-6 w-40" />

            <div className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((unusedItem, i) => (
                <SkeletonBlock key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <SkeletonBlock className="h-6 w-36" />

            <div className="mt-6 space-y-5">
              {Array.from({ length: 3 }).map((unusedItem, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="h-4 w-12" />
                  </div>

                  <SkeletonBlock className="mt-3 h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
