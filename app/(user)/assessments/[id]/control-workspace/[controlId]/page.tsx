"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import ControlWorkspace from "@/components/user/control-workspace/ControlWorkspace";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiItem {
  id: string;
  status: string;
  comments: string | null;
  owner: string | null;
  targetDate: string | null;
  _count?: { evidence: number };
  control: {
    id: string;
    code: string;
    title: string;
    description: string;
    severity: string;
    weight: number;
    framework?: { code: string };
  };
}

interface ApiResponse {
  items: ApiItem[];
}

interface ControlWorkspaceData {
  id: string; // The database control ID
  code: string; // The visual alphanumeric code
  itemId: string;
  framework: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  weight: number;
  assessmentId: string;
  comments: string | null;
  owner: string | null;
  targetDate: string | null;
  evidenceCount: number;
}

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const assessmentId = params?.id as string;
  const controlId = params?.controlId as string;

  const {
    data: control,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["control", assessmentId, controlId],
    queryFn: async () => {
      const data = await apiClient.get<ApiResponse>(
        `/api/assessments/${assessmentId}/items?search=${encodeURIComponent(controlId)}&limit=100`,
      );

      const items = data.items ?? [];
      const item = items.find(
        (i) => i.control.code === controlId || i.control.id === controlId || i.id === controlId,
      );

      if (!item) {
        throw new Error("Control not found in this assessment");
      }

      return {
        id: item.control.id,
        code: item.control.code,
        itemId: item.id,
        framework: item.control.framework?.code ?? "Unknown",
        title: item.control.title,
        description: item.control.description,
        severity: item.control.severity,
        status: item.status,
        weight: item.control.weight,
        assessmentId,
        comments: item.comments,
        owner: item.owner ?? null,
        targetDate: item.targetDate ?? null,
        evidenceCount: item._count?.evidence ?? 0,
      } as ControlWorkspaceData;
    },
    enabled: !!assessmentId && !!controlId,
  });

  const error =
    queryError instanceof Error ? queryError.message : queryError ? "Failed to load control" : null;

  if (!assessmentId || !controlId) {
    return <div className="p-6 text-sm text-red-500">Invalid route</div>;
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-[420px] max-w-full" />
        </div>

        {/* Progress Section */}
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-white p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-3 w-full rounded-full" />

            <div className="flex gap-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT PANEL */}
          <div className="xl:col-span-2 space-y-6">
            {/* Control Details */}
            <div className="rounded-2xl border border-slate-200 p-6 space-y-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
              </div>

              <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            {/* Evidence Section */}
            <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* AI Assistant */}
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-white p-5 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Requirements */}
            <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Related Controls */}
            <div className="rounded-2xl border border-slate-200 p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Discussion */}
            <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
              <Skeleton className="h-5 w-24" />

              <div className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>

              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Audit Trail */}
            <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
              <Skeleton className="h-5 w-24" />

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-12 flex-1" />
                </div>

                <div className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-12 flex-1" />
                </div>

                <div className="flex gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-12 flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((!loading && error) || !control) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-700">Failed to load control</h2>
          <p className="text-sm text-red-600 mt-1">{error ?? "Control not found"}</p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-gray-100"
            >
              ← Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ControlWorkspace control={control} />;
}
