import {
  type AssessmentDetailResponse,
  type AssessmentScoreResponse,
  type ChecklistResponse,
  type ChecklistSort,
  type Severity,
  type Status,
} from "@/app/(user)/assessments/[id]/checklist/types";
import { apiClient } from "@/lib/api-client";

interface ChecklistQueryOptions {
  assessmentId: string;
  page: number;
  limit: number;
  search: string;
  frameworks: string[];
  status: Status[];
  severity: Severity[];
  sort: ChecklistSort;
}

interface UpdateAssessmentItemPayload {
  status?: Status;
  comments?: string | null;
}

interface UpdateAssessmentItemResponse {
  score: number;
}

interface DuplicateAssessmentResponse {
  assessmentId: string;
  totalItems: number;
}

interface DeleteAssessmentResponse {
  id: string;
}

interface SortQuery {
  sortBy: "severity" | "status" | "code" | "updatedAt";
  sortOrder: "asc" | "desc";
}

function addListParam(params: URLSearchParams, key: string, values: string[]) {
  if (values.length > 0) {
    for (const value of values) {
      params.append(key, value);
    }
  }
}

function mapSortToQuery(sort: ChecklistSort): SortQuery {
  if (sort === "status") {
    return { sortBy: "status", sortOrder: "asc" };
  }

  if (sort === "id") {
    return { sortBy: "code", sortOrder: "asc" };
  }

  if (sort === "updated") {
    return { sortBy: "updatedAt", sortOrder: "desc" };
  }

  return { sortBy: "severity", sortOrder: "desc" };
}

export async function getAssessmentChecklist({
  assessmentId,
  page,
  limit,
  search,
  frameworks,
  status,
  severity,
  sort,
}: ChecklistQueryOptions): Promise<ChecklistResponse> {
  const params = new URLSearchParams();
  const { sortBy, sortOrder } = mapSortToQuery(sort);

  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("sortBy", sortBy);
  params.set("sortOrder", sortOrder);

  const trimmedSearch = search.trim();
  if (trimmedSearch.length > 0) {
    params.set("search", trimmedSearch);
  }

  addListParam(params, "framework", frameworks);
  addListParam(params, "status", status);
  addListParam(params, "severity", severity);

  const id = encodeURIComponent(assessmentId);
  return apiClient.get<ChecklistResponse>(`/api/assessments/${id}/items?${params.toString()}`);
}

export async function getAssessmentDetails(
  assessmentId: string,
): Promise<AssessmentDetailResponse> {
  const id = encodeURIComponent(assessmentId);
  return apiClient.get<AssessmentDetailResponse>(`/api/assessments/${id}`);
}

export async function getAssessmentScore(assessmentId: string): Promise<AssessmentScoreResponse> {
  const id = encodeURIComponent(assessmentId);
  return apiClient.get<AssessmentScoreResponse>(`/api/assessments/${id}/score`);
}

export async function updateAssessmentItem(
  assessmentId: string,
  itemId: string,
  payload: UpdateAssessmentItemPayload,
): Promise<UpdateAssessmentItemResponse> {
  const id = encodeURIComponent(assessmentId);
  const targetItemId = encodeURIComponent(itemId);

  return apiClient.patch<UpdateAssessmentItemResponse, UpdateAssessmentItemPayload>(
    `/api/assessments/${id}/items/${targetItemId}`,
    { body: payload },
  );
}

export async function duplicateAssessment(
  assessmentId: string,
): Promise<DuplicateAssessmentResponse> {
  const id = encodeURIComponent(assessmentId);
  return apiClient.post<DuplicateAssessmentResponse>(`/api/assessments/${id}/duplicate`);
}

export async function deleteAssessment(assessmentId: string): Promise<DeleteAssessmentResponse> {
  const id = encodeURIComponent(assessmentId);
  return apiClient.delete<DeleteAssessmentResponse>(`/api/assessments/${id}`);
}
