import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  computeFrameworkScores,
  computeOverallScore,
  type ScoreItemRow,
} from "@/lib/assessment-score";
import { prisma } from "@/lib/prisma";

type ItemStatus =
  | "NOT_STARTED"
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NOT_COMPLIANT"
  | "NOT_APPLICABLE";
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const reportAiKey = process.env.OPENAI_API_KEY?.trim();
const reportModel = reportAiKey
  ? createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: reportAiKey,
    })
  : null;

interface ReportRequestContext {
  assessmentId: string;
  userId: string;
}

interface EvidenceRow {
  id: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: Date;
}

interface ReportAssessmentItem {
  id: string;
  status: ItemStatus;
  owner: string | null;
  targetDate: Date | null;
  comments: string | null;
  remarks: string | null;
  evidenceNotes: string | null;
  evidence: EvidenceRow[];
  control: {
    id: string;
    code: string;
    title: string;
    description: string;
    severity: Severity;
    weight: number;
    isGateway: boolean;
    framework: {
      id: string;
      code: string;
      name: string;
    };
  };
}

interface ReportAssessment {
  id: string;
  status: string;
  score: number | null;
  createdAt: Date;
  completedAt: Date | null;
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
  items: ReportAssessmentItem[];
}

export interface ControlRow {
  code: string;
  title: string;
  frameworkCode: string;
  frameworkName: string;
  severity: string;
  status: ItemStatus;
  evidenceCount: number;
  riskScore: number;
  owner: string;
  targetDate: string;
}

interface EvidenceInventoryRow {
  code: string;
  title: string;
  count: number;
  examples: string;
  risk: string;
}

interface RemediationItem {
  title: string;
  priority: string;
  effort: string;
  rationale: string;
  score: number;
}

export interface ReportBundle {
  assessment: ReportAssessment;
  reportTitle: string;
  generatedAt: Date;
  overallScore: number;
  completionPercent: number;
  frameworkScores: Array<{
    frameworkCode: string;
    frameworkName: string;
    score: number;
  }>;
  readinessBand: string;
  riskSummary: {
    totalRiskScore: number;
    openHighRisks: number;
    openMediumRisks: number;
    openLowRisks: number;
    riskLevel: string;
  };
  controlRows: ControlRow[];
  evidenceRows: EvidenceInventoryRow[];
  remediation: RemediationItem[];
  executiveSummary: string;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function logReportTiming(step: string, startedAt: number) {
  if (process.env.REPORT_TIMINGS !== "true") {
    return;
  }

  const durationMs = Math.round(performance.now() - startedAt);
  process.stdout.write(`[report] ${step}: ${durationMs}ms\n`);
}

async function measureReportStep<T>(step: string, action: () => Promise<T>): Promise<T> {
  const startedAt = performance.now();
  const result = await action();
  logReportTiming(step, startedAt);
  return result;
}

export function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

export function readinessBand(score: number): string {
  if (score >= 80) {
    return "Compliant";
  }

  if (score >= 50) {
    return "Partially Compliant";
  }

  return "Non-Compliant";
}

export function riskWeight(status: ItemStatus, severity: Severity): number {
  if (status === "COMPLIANT" || status === "NOT_APPLICABLE") {
    return 0;
  }

  if (status === "PARTIALLY_COMPLIANT") {
    if (severity === "CRITICAL" || severity === "HIGH") {
      return 2;
    }
    if (severity === "MEDIUM") {
      return 1;
    }
    return 0;
  }

  if (severity === "CRITICAL") {
    return 3;
  }
  if (severity === "HIGH") {
    return 3;
  }
  if (severity === "MEDIUM") {
    return 2;
  }
  return 1;
}

export function getPriority(status: ItemStatus, severity: Severity): string {
  if (status === "NOT_COMPLIANT") {
    return severity === "CRITICAL" || severity === "HIGH" ? "High" : "Medium";
  }

  if (status === "PARTIALLY_COMPLIANT") {
    return severity === "LOW" ? "Low" : "Medium";
  }

  return "Low";
}

export function getEffort(weight: number, severity: Severity): string {
  if (severity === "CRITICAL" || weight >= 4) {
    return "High";
  }

  if (severity === "HIGH" || weight >= 2) {
    return "Medium";
  }

  return "Low";
}

function sanitizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function buildSummaryNarrative(bundle: ReportBundle): string {
  const organizationName = bundle.assessment.organization.productName;
  const frameworkSummary = bundle.frameworkScores
    .slice(0, 3)
    .map((framework) => `${framework.frameworkCode} at ${framework.score.toFixed(1)}%`)
    .join(", ");

  const highRiskText =
    bundle.riskSummary.openHighRisks > 0
      ? `${bundle.riskSummary.openHighRisks} high-risk control${bundle.riskSummary.openHighRisks === 1 ? "" : "s"} remain open`
      : "No high-risk controls remain open";

  return sanitizeText(
    `${organizationName} currently sits at ${bundle.overallScore.toFixed(1)}% readiness, which is ${bundle.readinessBand.toLowerCase()}. Completion is ${bundle.completionPercent.toFixed(1)}% across ${bundle.controlRows.length} controls. ${highRiskText}, with a total risk score of ${bundle.riskSummary.totalRiskScore}. Key framework performance is ${frameworkSummary || "still being established"}. Focus remediation on the highest-severity partial and non-compliant controls to move the assessment above the 80% compliance threshold.`,
  );
}

async function generateNarrative(bundle: ReportBundle): Promise<string> {
  if (!reportModel) {
    return buildSummaryNarrative(bundle);
  }

  const prompt = `
You are writing the executive summary for a compliance readiness PDF.

Write 2 short paragraphs in a professional, concise tone.
Focus on the main readiness result, major risks, and immediate remediation priorities.
Avoid bullet points, headings, and markdown.

Organization: ${bundle.assessment.organization.productName}
Overall readiness: ${bundle.overallScore.toFixed(1)}%
Completion: ${bundle.completionPercent.toFixed(1)}%
Risk score: ${bundle.riskSummary.totalRiskScore}
High risks open: ${bundle.riskSummary.openHighRisks}
Framework scores: ${bundle.frameworkScores.map((framework) => `${framework.frameworkCode} ${framework.score.toFixed(1)}%`).join(", ")}
Top control gaps: ${bundle.remediation
    .slice(0, 4)
    .map((item) => item.title)
    .join(", ")}
  `;

  try {
    const result = await withTimeout(
      generateText({
        model: reportModel("llama-3.3-70b-versatile"),
        prompt,
      }),
      2500,
      "Executive summary generation timed out",
    );

    const narrative = sanitizeText(result.text);
    return narrative.length > 0 ? narrative : buildSummaryNarrative(bundle);
  } catch {
    return buildSummaryNarrative(bundle);
  }
}

async function fetchAssessmentBundle(context: ReportRequestContext): Promise<ReportAssessment> {
  const assessment = await prisma.assessment.findFirst({
    where: {
      id: context.assessmentId,
      userId: context.userId,
    },
    select: {
      id: true,
      status: true,
      score: true,
      createdAt: true,
      completedAt: true,
      organization: {
        select: {
          id: true,
          name: true,
          productName: true,
          description: true,
          services: true,
          targetCustomers: true,
          problemSolved: true,
          dataHandled: true,
          regions: true,
        },
      },
      items: {
        orderBy: {
          control: {
            code: "asc",
          },
        },
        select: {
          id: true,
          status: true,
          owner: true,
          targetDate: true,
          comments: true,
          remarks: true,
          evidenceNotes: true,
          evidence: {
            select: {
              id: true,
              originalName: true,
              fileUrl: true,
              mimeType: true,
              fileSize: true,
              uploadedAt: true,
            },
          },
          control: {
            select: {
              id: true,
              code: true,
              title: true,
              description: true,
              severity: true,
              weight: true,
              isGateway: true,
              framework: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!assessment) {
    throw new Error("404: Assessment not found");
  }

  return {
    ...assessment,
    organization: {
      id: assessment.organization.id,
      name: assessment.organization.name,
      productName: assessment.organization.productName ?? assessment.organization.name,
      description: assessment.organization.description ?? "Not provided",
      services: assessment.organization.services ?? "Not provided",
      targetCustomers: assessment.organization.targetCustomers ?? "Not provided",
      problemSolved: assessment.organization.problemSolved ?? "Not provided",
      dataHandled: assessment.organization.dataHandled ?? [],
      regions: assessment.organization.regions ?? [],
    },
  };
}

function toScoreRows(assessment: ReportAssessment): ScoreItemRow[] {
  return assessment.items.map((item) => ({
    status: item.status,
    control: {
      weight: item.control.weight,
      isGateway: item.control.isGateway,
      frameworkId: item.control.framework.id,
      framework: {
        id: item.control.framework.id,
        code: item.control.framework.code,
        name: item.control.framework.name,
      },
    },
  }));
}

function buildControlRows(assessment: ReportAssessment): ControlRow[] {
  return assessment.items.map((item) => ({
    code: item.control.code,
    title: item.control.title,
    frameworkCode: item.control.framework.code,
    frameworkName: item.control.framework.name,
    severity: item.control.severity,
    status: item.status,
    evidenceCount: item.evidence.length,
    riskScore: riskWeight(item.status, item.control.severity),
    owner: item.owner?.trim() || "Unassigned",
    targetDate: item.targetDate ? item.targetDate.toISOString().slice(0, 10) : "-",
  }));
}

function buildEvidenceRows(assessment: ReportAssessment): EvidenceInventoryRow[] {
  return assessment.items.map((item) => ({
    code: item.control.code,
    title: item.control.title,
    count: item.evidence.length,
    examples:
      item.evidence.length > 0
        ? item.evidence
            .slice(0, 2)
            .map((row) => row.originalName)
            .join(", ")
        : "No evidence uploaded yet",
    risk:
      item.status === "NOT_COMPLIANT"
        ? "High"
        : item.status === "PARTIALLY_COMPLIANT"
          ? item.control.severity === "CRITICAL" || item.control.severity === "HIGH"
            ? "High"
            : "Medium"
          : "Low",
  }));
}

function buildRemediationItems(assessment: ReportAssessment): RemediationItem[] {
  const prioritized = assessment.items
    .filter((item) => item.status === "NOT_COMPLIANT" || item.status === "PARTIALLY_COMPLIANT")
    .map((item) => ({
      title: `${item.control.code} - ${item.control.title}`,
      priority: getPriority(item.status, item.control.severity),
      effort: getEffort(item.control.weight, item.control.severity),
      rationale:
        item.status === "NOT_COMPLIANT"
          ? "Control is open and requires immediate remediation."
          : "Control is partially implemented and needs hardening.",
      score: riskWeight(item.status, item.control.severity),
    }))
    .sort((a, b) => b.score - a.score);

  return prioritized.slice(0, 10).map(({ title, priority, effort, rationale, score }) => ({
    title,
    priority,
    effort,
    rationale,
    score,
  }));
}

export async function buildReportBundle(context: ReportRequestContext): Promise<ReportBundle> {
  const assessment = await fetchAssessmentBundle(context);
  const scoreRows = toScoreRows(assessment);
  const overallScore = computeOverallScore(scoreRows);
  const frameworkScores = computeFrameworkScores(scoreRows);
  const completionCount = assessment.items.filter((item) => item.status !== "NOT_STARTED").length;
  const completionPercent =
    assessment.items.length > 0 ? (completionCount / assessment.items.length) * 100 : 0;

  const controlRows = buildControlRows(assessment);
  const evidenceRows = buildEvidenceRows(assessment);
  const remediation = buildRemediationItems(assessment);
  const totalRiskScore = controlRows.reduce((sum, row) => sum + row.riskScore, 0);
  const openHighRisks = controlRows.filter((row) => row.riskScore >= 3).length;
  const openMediumRisks = controlRows.filter((row) => row.riskScore === 2).length;
  const openLowRisks = controlRows.filter((row) => row.riskScore === 1).length;

  const bundle: ReportBundle = {
    assessment,
    reportTitle: "Compliance Readiness Report",
    generatedAt: new Date(),
    overallScore,
    completionPercent,
    frameworkScores,
    readinessBand: readinessBand(overallScore),
    riskSummary: {
      totalRiskScore,
      openHighRisks,
      openMediumRisks,
      openLowRisks,
      riskLevel: totalRiskScore >= 18 ? "High" : totalRiskScore >= 8 ? "Medium" : "Low",
    },
    controlRows,
    evidenceRows,
    remediation,
    executiveSummary: "",
  };

  bundle.executiveSummary = await measureReportStep("aiSummary", () => generateNarrative(bundle));
  return bundle;
}
