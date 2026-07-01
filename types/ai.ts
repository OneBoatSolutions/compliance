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
  // New optional fields for enriched AI output
  businessFit?: {
    applicability: "APPLICABLE" | "PARTIALLY_APPLICABLE" | "NOT_APPLICABLE";
    rationale: string;
  };
  evidenceValidation?: {
    overallHealth: "SUFFICIENT" | "PARTIALLY_SUFFICIENT" | "INSUFFICIENT" | "MISSING";
    missingTypes: string[];
    recommendations: string[];
  };
  confidence?: number;
}

export interface GenerateRemediationInput {
  frameworkName: string;
  controlId: string;
  controlTitle: string;
  controlDescription: string;
  currentStatus: string;
  severity: string;
  regenerate?: boolean;
  assessmentId?: string;
  userNotes?: string;
  uploadedEvidenceFiles?: string[];
  productDescription?: string;
  targetAudience?: string;
}
