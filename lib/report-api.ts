import { apiClient } from "@/lib/api-client";
import { ReportViewResponse } from "./report-types";

export const fetchReportView = async (assessmentId: string) => {
  return await apiClient.get<ReportViewResponse>(`/api/reports/${assessmentId}/view`);
};
