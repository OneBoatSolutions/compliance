"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import ControlWorkspace from "@/components/user/control-workspace/ControlWorkspace";

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
  id: string;
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
        id: item.control.code,
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
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6d18ff] border-t-transparent" />
          <p className="text-sm text-slate-500">Loading control workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !control) {
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
