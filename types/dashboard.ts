/** Payload inside `successResponse` `data` for GET /api/dashboard */

export type DashboardActivityType =
  | "report_generated"
  | "assessment_created"
  | "assessment_updated"
  | "evidence_uploaded";

export interface DashboardActivityItem {
  id: string;
  type: DashboardActivityType;
  title: string;
  detail: string;
  occurredAt: string;
}

export interface DashboardFrameworkScore {
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

export interface DashboardAssessmentSummary {
  id: string;
  organizationName: string;
  status: string;
  score: number | null;
  updatedAt: string;
  frameworkScores: DashboardFrameworkScore[];
}

export interface DashboardApiData {
  totalAssessments: number;
  averageScore: number;
  criticalGaps: number;
  reportsGenerated: number;
  recentActivity: DashboardActivityItem[];
  assessments: DashboardAssessmentSummary[];
}
