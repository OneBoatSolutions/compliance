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
export interface HeatmapItem {
  severity: string;
  status: string;
  count: number;
}
export interface ReportViewResponse {
  reportTitle: string;

  generatedAt: string;

  overallScore: number;

  completionPercent: number;

  readinessBand: string;

  executiveSummary: string;

  findings: {
    type: "success" | "warning" | "info" | "insight";
    text: string;
  }[];

  alerts: {
    title: string;
    description: string;
  }[];

  criticalRisksCount: number;

  criticalRisks: {
    code: string;
    title: string;
    severity: string;
    status: string;
  }[];

  topRecommendations: {
    title: string;
  }[];

  frameworkScores: {
    frameworkCode: string;
    frameworkName: string;
    score: number;
  }[];

  riskSummary: {
    totalRiskScore: number;
    openHighRisks: number;
    openMediumRisks: number;
    openLowRisks: number;
    riskLevel: string;
  };

  distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };

  heatmap: HeatmapItem[];

  remediation: {
    title: string;
    priority: string;
    effort: string;
    rationale: string;
    score: number;
  }[];

  controlRows: {
    code: string;

    title: string;

    frameworkCode: string;

    frameworkName: string;

    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

    status:
      | "NOT_STARTED"
      | "COMPLIANT"
      | "PARTIALLY_COMPLIANT"
      | "NOT_COMPLIANT"
      | "NOT_APPLICABLE";

    evidenceCount: number;

    riskScore: number;

    owner: string;

    targetDate: string;

    uiStatus: "COMPLETED" | "IN_PROGRESS" | "OVERDUE";

    priority: "HIGH" | "MED" | "LOW";

    progress: number;
  }[];

  evidenceRows: {
    code: string;

    title: string;

    count: number;

    examples: string;

    risk: string;
  }[];

  organization: {
    id: string;

    name: string;

    productName: string;

    description: string;

    services: string;

    targetCustomers: string;

    problemSolved: string;

    dataHandled: string[];

    regions: string[];
  };

  assessment: {
    id: string;

    status: string;

    score: number | null;

    createdAt: string;

    completedAt: string | null;
  };
}
