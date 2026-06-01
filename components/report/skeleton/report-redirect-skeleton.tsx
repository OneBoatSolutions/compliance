import SkeletonBlock from "@/components/ui/skeletons/skeleton-block";

export default function ReportsRedirectSkeleton() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SkeletonBlock className="h-5 w-40" />

        <SkeletonBlock className="mt-3 h-4 w-72" />

        <div className="mt-5 flex gap-2">
          <SkeletonBlock className="h-2 w-2 rounded-full" />
          <SkeletonBlock className="h-2 w-2 rounded-full" />
          <SkeletonBlock className="h-2 w-2 rounded-full" />
        </div>
      </div>
    </div>
  );
}
