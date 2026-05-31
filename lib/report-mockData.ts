import { Finding } from "@/lib/report-types";
import { DataInventoryItem } from "@/lib/report-types";
import { RoadmapItem } from "@/lib/report-types";

export const mockReportData = {
  appName: "HealthTrack App",

  frameworks: ["SOC 2", "ISO 27001", "HIPAA"],

  generatedAt: new Date().toISOString(),

  preparedFor: "HealthTrack Systems",

  version: "1.0",

  summary: {
    score: 72,

    findings: [
      {
        type: "success",
        text: "MFA enabled across majority of systems",
      },
      {
        type: "warning",
        text: "Access control gaps in internal dashboards",
      },
      {
        type: "info",
        text: "Audit logging partially implemented",
      },
      {
        type: "insight",
        text: "Aligned with HIPAA, SOC2, ISO controls",
      },
    ] as Finding[],

    alerts: [
      {
        title: "Insufficient Risk Coverage",
        description: "Some critical services lack monitoring and audit coverage.",
      },
      {
        title: "Inconsistent MFA Enforcement",
        description: "MFA not enforced across all administrative interfaces.",
      },
    ],
  },

  risks: {
    total: 42,
    high: 10,
    medium: 20,
    low: 12,
  },

  quickRemediation: {
    items: [
      {
        title: "Implement RBAC",
        priority: "High",
        effort: "Medium",
      },
      {
        title: "Enable audit logging",
        priority: "High",
        effort: "Low",
      },
    ],
  },

  organization: {
    name: "Elpherion Health Systems",
    systems: "HealthPlus Mobile & Web App",
    reportId: "EHS-QR3-Q3-2024",

    dataInventory: [
      {
        category: "PII (Personal Identifiable Information)",
        inScope: true,
        examples: "Full Name, Email, Address, Phone",
        risk: "MED",
      },
      {
        category: "PHI (Protected Health Information)",
        inScope: true,
        examples: "Medical Records, Treatment Data",
        risk: "HIGH",
      },
      {
        category: "Financial / Payment Data",
        inScope: true,
        examples: "Card #s (tokenized), Transaction History",
        risk: "MED",
      },
      {
        category: "Biometric Data",
        inScope: false,
        examples: "Face ID (User Opt-in Only)",
        risk: "LOW",
      },
    ] as DataInventoryItem[],

    frameworks: [
      {
        name: "HIPAA",
        score: 72,
        controls: 12,
        minorGaps: 4,
        highRisk: 1,
      },
      {
        name: "GDPR",
        score: 85,
        controls: 18,
        minorGaps: 2,
        highRisk: 0,
      },
      {
        name: "PCI-DSS",
        score: 68,
        controls: 21,
        minorGaps: 6,
        highRisk: 2,
      },
    ],
  },
  riskAnalysis: {
    total: 42,

    distribution: {
      critical: 6,
      high: 10,
      medium: 16,
      low: 10,
    },

    heatmap: [
      { impact: 5, likelihood: 4, count: 6 },
      { impact: 4, likelihood: 3, count: 10 },
      { impact: 3, likelihood: 2, count: 16 },
      { impact: 2, likelihood: 2, count: 5 },
      { impact: 1, likelihood: 1, count: 5 },
    ],

    remediation: [
      {
        id: "AC-01",
        action: "Access Control Policy & Procedures",
        owner: "Sarah Chen",
        dueDate: "Mar 31",
        progress: 100,
      },
      {
        id: "AU-02",
        action: "Audit Record Retention",
        owner: "Jennifer Reyes",
        dueDate: "Mar 15",
        progress: 45,
      },
      {
        id: "CP-03",
        action: "Information System Backup",
        owner: "Cloud Ops",
        dueDate: "Feb 28",
        progress: 82,
      },
    ],
  },

  roadmap: {
    summary: {
      total: 12,
      completed: 4,
      inProgress: 5,
      overdue: 3,
    },

    items: [
      {
        id: "AC-01",
        title: "Implement Access Control Policy",
        owner: "Sarah Chen",
        dueDate: "2024-03-31",
        status: "COMPLETED",
        priority: "HIGH",
      },
      {
        id: "AU-02",
        title: "Audit Log Retention Setup",
        owner: "Jennifer Reyes",
        dueDate: "2024-03-15",
        status: "IN_PROGRESS",
        priority: "HIGH",
      },
      {
        id: "CP-03",
        title: "Backup and Recovery System",
        owner: "Cloud Ops",
        dueDate: "2024-02-28",
        status: "OVERDUE",
        priority: "MED",
      },
    ] as RoadmapItem[],
  },
};
