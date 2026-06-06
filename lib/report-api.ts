import { apiClient } from "@/lib/api-client";
import { ReportData, ReportViewResponse } from "./report-types";

export const fetchReport = async (assessmentId: string) => {
  return await apiClient.get<ReportData>(`/api/reports/${assessmentId}`);
};

export const fetchReportView = async (assessmentId: string) => {
  return await apiClient.get<ReportViewResponse>(`/api/reports/${assessmentId}/view`);
};
