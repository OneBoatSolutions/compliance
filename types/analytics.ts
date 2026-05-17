import type { ItemStatus, Severity } from "@prisma/client";

export interface AnalyticsTrendPoint {
  date: string;
  score: number;
}

export interface AnalyticsFrameworkComparison {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

export interface AnalyticsStatusDistribution {
  status: ItemStatus;
  count: number;
}

export interface AnalyticsCategoryCompletion {
  category: string;
  compliant: number;
  partial: number;
  nonCompliant: number;
  notApplicable: number;
  total: number;
}

export interface AnalyticsRiskHeatmapCell {
  severity: Severity;
  status: ItemStatus;
  count: number;
}

export interface AnalyticsRemediationProgress {
  totalSteps: number;
  completedSteps: number;
  activePlans: number;
  completionRate: number;
}

export interface AnalyticsApiData {
  trend: AnalyticsTrendPoint[];
  frameworkComparison: AnalyticsFrameworkComparison[];
  statusDistribution: AnalyticsStatusDistribution[];
  categoryCompletion: AnalyticsCategoryCompletion[];
  riskHeatmap: AnalyticsRiskHeatmapCell[];
  remediationProgress: AnalyticsRemediationProgress;
}
