import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

export default function FrameworkTableSkeleton() {
  return (
    <section className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-6 w-48" />

        <SkeletonBlock className="h-9 w-28 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        {/* Header */}
        <div className="grid grid-cols-2 gap-4 border-b bg-gray-50 p-4">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-4 w-20" />
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((unusedItem, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 border-b p-4 items-center">
            <SkeletonBlock className="h-4 w-40" />

            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-2 flex-1 rounded-full" />

              <SkeletonBlock className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
