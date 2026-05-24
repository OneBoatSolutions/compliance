"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface AssessmentListItem {
  id: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  score: number | null;
  createdAt: string;
  organizationId: string;
}

function resolveAssessmentsTarget(assessments: AssessmentListItem[]): string {
  if (assessments.length > 0) {
    return `/assessments/${assessments[0].id}/checklist`;
  }

  return "/onboarding";
}

export default function AssessmentsIndexPage() {
  const router = useRouter();

  const assessmentsQuery = useQuery({
    queryKey: ["assessments", "index"],
    queryFn: () => apiClient.get<AssessmentListItem[]>("/api/assessments"),
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!assessmentsQuery.isSuccess) {
      return;
    }

    router.replace(resolveAssessmentsTarget(assessmentsQuery.data));
  }, [assessmentsQuery.data, assessmentsQuery.isSuccess, router]);

  if (assessmentsQuery.isError) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-700">Failed to load assessments</h2>
          <p className="mt-1 text-sm text-red-600">
            {assessmentsQuery.error instanceof Error
              ? assessmentsQuery.error.message
              : "Please try again."}
          </p>
          <button
            onClick={() => void assessmentsQuery.refetch()}
            className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-700">Loading assessments...</h2>
        <p className="mt-1 text-sm text-slate-500">Redirecting to your latest checklist.</p>
      </div>
    </div>
  );
}
