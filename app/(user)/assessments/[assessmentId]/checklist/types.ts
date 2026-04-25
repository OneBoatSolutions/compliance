export type Status =
  | "NOT_STARTED"
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NOT_COMPLIANT"
  | "NOT_APPLICABLE";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Control {
  itemId: string;
  id: string;
  title: string;
  description: string;
  category: string | null;
  frameworkId: string;
  frameworkName: string;
  framework: string;
  severity: Severity;
  status: Status;
  evidenceCount: number;
  updatedAt: string;
  comments: string | null;
  weight: number;
}

export interface FrameworkFilterOption {
  id: string;
  code: string;
  name: string;
}

export interface FrameworkScore {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

export interface ChecklistMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ChecklistApiItem {
  id: string;
  status: Status;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    evidence: number;
  };
  control: {
    id: string;
    code: string;
    title: string;
    description: string;
    category: string | null;
    severity: Severity;
    weight: number;
    framework: {
      id: string;
      code: string;
      name: string;
    };
  };
}

export interface ChecklistAssessmentInfo {
  id: string;
  organizationId: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  score: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistResponse {
  items: ChecklistApiItem[];
  meta: ChecklistMeta;
}

export interface AssessmentDetailResponse extends ChecklistAssessmentInfo {
  items: ChecklistApiItem[];
}

export interface AssessmentChecklistData {
  assessment: ChecklistAssessmentInfo;
  items: ChecklistApiItem[];
  meta: ChecklistMeta;
}

export interface AssessmentScoreResponse {
  assessmentId: string;
  score: number;
  frameworkScores: FrameworkScore[];
}

export type ChecklistSort = "severity" | "status" | "id" | "updated";
