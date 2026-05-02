import axios from "axios";
import { ReportData } from "./report-types";

export const fetchReport = async (assessmentId: string) => {
  const res = await axios.get<ReportData>(`/api/reports/${assessmentId}`);
  return res.data;
};

export const generateReport = async (assessmentId: string) => {
  const res = await axios.post(`/api/reports/${assessmentId}/generate`);
  return res.data;
};

export const downloadReport = async (assessmentId: string) => {
  const res = await axios.get(`/api/reports/${assessmentId}/download`);
  return res.data.url;
};
