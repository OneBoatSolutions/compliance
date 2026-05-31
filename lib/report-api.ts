import { apiClient } from "@/lib/api-client";
import { ReportData, ReportViewResponse } from "./report-types";

export const fetchReport = async (assessmentId: string) => {
  return await apiClient.get<ReportData>(`/api/reports/${assessmentId}`);
};

export const fetchReportView = async (assessmentId: string) => {
  return await apiClient.get<ReportViewResponse>(`/api/reports/${assessmentId}/view`);
};

export const generateReport = async (assessmentId: string) => {
  return await apiClient.post<{ fileUrl: string }>(`/api/reports/${assessmentId}/generate`);
};

export const downloadReport = async (assessmentId: string) => {
  const res = await apiClient.get<{ url: string }>(`/api/reports/${assessmentId}/download`);
  return res.url;
};
