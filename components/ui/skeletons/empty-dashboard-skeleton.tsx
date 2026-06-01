import SkeletonBlock from "./skeleton-block";

export default function EmptyDashboardSkeleton() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <main className="flex-1 pt-24 pb-16 px-6 w-full max-w-6xl mx-auto">
        {/* Hero */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <SkeletonBlock className="h-10 w-96" />

              <SkeletonBlock className="mt-5 h-4 w-full max-w-xl" />
              <SkeletonBlock className="mt-2 h-4 w-[85%]" />
              <SkeletonBlock className="mt-2 h-4 w-[70%]" />
            </div>

            <SkeletonBlock className="h-64 w-64 rounded-full" />
          </div>
        </section>

        {/* Empty State */}
        <section className="mb-12 rounded-xl border border-slate-200 bg-white p-12">
          <div className="flex flex-col items-center">
            <SkeletonBlock className="h-20 w-20 rounded-full" />

            <SkeletonBlock className="mt-6 h-8 w-64" />

            <SkeletonBlock className="mt-5 h-4 w-full max-w-md" />
            <SkeletonBlock className="mt-2 h-4 w-[80%] max-w-sm" />

            <SkeletonBlock className="mt-8 h-14 w-72 rounded-lg" />
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((unusedItem, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-6">
              <div className="flex justify-between">
                <SkeletonBlock className="h-8 w-8 rounded-full" />
                <SkeletonBlock className="h-5 w-5 rounded-md" />
              </div>

              <SkeletonBlock className="mt-6 h-5 w-32" />

              <SkeletonBlock className="mt-4 h-4 w-full" />
              <SkeletonBlock className="mt-2 h-4 w-[90%]" />
              <SkeletonBlock className="mt-2 h-4 w-[75%]" />
            </div>
          ))}
        </section>

        {/* Resources */}
        <section>
          <SkeletonBlock className="h-8 w-52" />

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((unusedItem, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-white p-4">
                <SkeletonBlock className="h-6 w-6 rounded-md" />
                <SkeletonBlock className="mt-4 h-4 w-24" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
