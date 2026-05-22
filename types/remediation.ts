export type RemediationPriority = "HIGH" | "MEDIUM" | "LOW";
export type RemediationStepStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type RemediationPlanStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface RemediationPlanStep {
  id?: string;
  title: string;
  description: string;
  priority: RemediationPriority;
  owner: string;
  estimatedHours: number;
  status?: RemediationStepStatus;
  sortOrder?: number;
  completedAt?: string | null;
}

export interface RemediationPlanData {
  id?: string;
  assessmentId?: string;
  assessmentItemId: string;
  controlId: string;
  controlTitle: string;
  controlDescription: string;
  frameworkName: string;
  currentStatus: string;
  severity: string;
  title: string;
  summary?: string | null;
  status?: RemediationPlanStatus;
  steps: RemediationPlanStep[];
  policies: string[];
  technicalControls: string[];
  generatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
