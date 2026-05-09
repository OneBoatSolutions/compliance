export type FindingType = "success" | "warning" | "info" | "insight";

export interface Finding {
  type: FindingType;
  text: string;
}

export type RiskLevel = "LOW" | "MED" | "HIGH";

export interface DataInventoryItem {
  category: string;
  inScope: boolean;
  examples: string;
  risk: RiskLevel;
}

export interface ReportData {
  id: string;
  assessmentId: string;

  summary: {
    score: number;
    keyFindings: string[];
  };

  organization: {
    name: string;
    frameworkScores: {
      name: string;
      score: number;
    }[];
  };

  risks: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };

  remediation: {
    items: {
      title: string;
      priority: string;
      effort: string;
    }[];
  };
}

export type Status = "COMPLETED" | "IN_PROGRESS" | "OVERDUE";
export type Priority = "HIGH" | "MED" | "LOW";

export interface RoadmapItem {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: Status;
  priority: Priority;
}
