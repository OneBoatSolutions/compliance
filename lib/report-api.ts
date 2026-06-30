import { apiClient } from "@/lib/api-client";
import { ReportData, ReportViewResponse } from "./report-types";

export interface ReportHistoryItem {
  id: string;
  type: string;
  format: string;
  generatedAt: string;
  url: string | null;
}

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
  const response = await apiClient.get<{ url: string }>(`/api/reports/${assessmentId}/download`);

  return response.url;
};

export const fetchReportHistory = async (assessmentId: string) => {
  return await apiClient.get<ReportHistoryItem[]>(`/api/reports/${assessmentId}/history`);
};
