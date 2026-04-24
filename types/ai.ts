export type RemediationPriority = "HIGH" | "MEDIUM" | "LOW";

export interface RemediationStep {
  title: string;
  description: string;
  priority: RemediationPriority;
  owner: string;
  estimatedHours: number;
}

export interface RemediationResponse {
  steps: RemediationStep[];
  policies: string[];
  technicalControls: string[];
}

export interface GenerateRemediationInput {
  frameworkName: string;
  controlId: string;
  controlTitle: string;
  controlDescription: string;
  currentStatus: string;
  severity: string;
  regenerate?: boolean;
}
