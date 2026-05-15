import fs from "node:fs";
import path from "node:path";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import {
  computeFrameworkScores,
  computeOverallScore,
  type ScoreItemRow,
} from "@/lib/assessment-score";
import { prisma } from "@/lib/prisma";
import { extractStorageKeyFromUrl, uploadFileToStorage } from "@/services/storage-service";

type ItemStatus =
  | "NOT_STARTED"
  | "COMPLIANT"
  | "PARTIALLY_COMPLIANT"
  | "NOT_COMPLIANT"
  | "NOT_APPLICABLE";
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const brandPurpleDark = "#4C1D95";
const slate900 = "#0F172A";
const slate700 = "#334155";
const slate500 = "#64748B";
const slate200 = "#E2E8F0";

const reportAiKey = process.env.OPENAI_API_KEY?.trim();
const reportModel = reportAiKey
  ? createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: reportAiKey,
    })
  : null;

let pdfkitAssetsPrepared = false;

function ensurePdfkitFontAssets() {
  if (pdfkitAssetsPrepared) {
    return;
  }

  let sourceHelveticaPath: string;
  try {
    const runtimeRequire = (0, eval)("require") as NodeRequire;
    sourceHelveticaPath = runtimeRequire.resolve("pdfkit/js/data/Helvetica.afm");
  } catch {
    // If the path cannot be resolved, let PDFKit fail naturally with its own error.
    return;
  }

  const sourceDir = path.dirname(sourceHelveticaPath);
  const afmFiles = [
    "Helvetica.afm",
    "Helvetica-Bold.afm",
    "Helvetica-Oblique.afm",
    "Helvetica-BoldOblique.afm",
    "Times-Roman.afm",
    "Times-Bold.afm",
    "Times-Italic.afm",
    "Times-BoldItalic.afm",
    "Courier.afm",
    "Courier-Bold.afm",
    "Courier-Oblique.afm",
    "Courier-BoldOblique.afm",
    "Symbol.afm",
    "ZapfDingbats.afm",
  ];

  const targetDirs = [
    path.join(process.cwd(), ".next", "server", "vendor-chunks", "data"),
    path.join(process.cwd(), ".next", "server", "chunks", "data"),
  ];

  for (const targetDir of targetDirs) {
    try {
      fs.mkdirSync(targetDir, { recursive: true });

      for (const filename of afmFiles) {
        const source = path.join(sourceDir, filename);
        const target = path.join(targetDir, filename);

        if (!fs.existsSync(source) || fs.existsSync(target)) {
          continue;
        }

        fs.copyFileSync(source, target);
      }
    } catch {
      // Non-fatal: PDFKit will still throw if assets are truly unavailable.
    }
  }

  pdfkitAssetsPrepared = true;
}

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

interface ControlRow {
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

interface ReportBundle {
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

export interface GeneratedReportSummary {
  reportId: string;
  assessmentId: string;
  fileUrl: string;
  generatedAt: string;
  score: number;
  completionPercent: number;
  frameworkScores: Array<{
    frameworkCode: string;
    frameworkName: string;
    score: number;
  }>;
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

function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

function readinessBand(score: number): string {
  if (score >= 80) {
    return "Compliant";
  }

  if (score >= 50) {
    return "Partially Compliant";
  }

  return "Non-Compliant";
}

function riskWeight(status: ItemStatus, severity: Severity): number {
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

function getPriority(status: ItemStatus, severity: Severity): string {
  if (status === "NOT_COMPLIANT") {
    return severity === "CRITICAL" || severity === "HIGH" ? "High" : "Medium";
  }

  if (status === "PARTIALLY_COMPLIANT") {
    return severity === "LOW" ? "Low" : "Medium";
  }

  return "Low";
}

function getEffort(weight: number, severity: Severity): string {
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

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitLines(input: string, maxLength: number): string[] {
  const words = input.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (word.length > maxLength) {
      lines.push(word.slice(0, maxLength - 1));
      current = word.slice(maxLength - 1);
      continue;
    }

    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

function buildReadinessChartSvg(score: number): string {
  const percent = Math.max(0, Math.min(100, score));
  const circ = 2 * Math.PI * 52;
  const dash = circ - (percent / 100) * circ;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
      <rect width="320" height="200" rx="24" fill="#ffffff" />
      <circle cx="104" cy="100" r="52" fill="none" stroke="#EDE9FE" stroke-width="16" />
      <circle cx="104" cy="100" r="52" fill="none" stroke="#6D28D9" stroke-width="16"
        stroke-linecap="round" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${dash.toFixed(2)}"
        transform="rotate(-90 104 100)" />
      <text x="104" y="96" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#0F172A">${percent.toFixed(0)}%</text>
      <text x="104" y="122" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748B">Readiness</text>
      <text x="184" y="70" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="700" fill="#0F172A">Compliance</text>
      <text x="184" y="98" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748B">Overall weighted maturity</text>
      <rect x="184" y="118" width="112" height="14" rx="7" fill="#EDE9FE" />
      <rect x="184" y="118" width="${Math.max(6, Math.round((percent / 100) * 112))}" height="14" rx="7" fill="#6D28D9" />
      <text x="184" y="156" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#64748B">${percent >= 80 ? "Compliant" : percent >= 50 ? "Partially compliant" : "Needs attention"}</text>
    </svg>
  `;
}

function buildFrameworkChartSvg(frameworkScores: ReportBundle["frameworkScores"]): string {
  const rows = frameworkScores;
  const height = Math.max(180, 44 + rows.length * 34);
  const maxScore = Math.max(100, ...rows.map((row) => row.score));

  const bars = rows
    .map((row, index) => {
      const y = 48 + index * 34;
      const width = Math.max(4, Math.round((row.score / maxScore) * 210));
      return `
        <text x="16" y="${y + 11}" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#334155">${escapeXml(row.frameworkCode)}</text>
        <rect x="88" y="${y}" width="210" height="16" rx="8" fill="#EDE9FE" />
        <rect x="88" y="${y}" width="${width}" height="16" rx="8" fill="#6D28D9" />
        <text x="308" y="${y + 12}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#64748B">${row.score.toFixed(1)}%</text>
      `;
    })
    .join("\n");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="${height}" viewBox="0 0 320 ${height}">
      <rect width="320" height="${height}" rx="24" fill="#ffffff" />
      <text x="16" y="26" font-family="Helvetica, Arial, sans-serif" font-size="16" font-weight="700" fill="#0F172A">Framework scores</text>
      <text x="16" y="40" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#64748B">Framework scores by weighted readiness</text>
      ${bars}
    </svg>
  `;
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

  return assessment;
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

function addPageHeader(doc: PDFKit.PDFDocument, title: string, subtitle?: string) {
  doc.save();
  doc.rect(0, 0, doc.page.width, 74).fill(brandPurpleDark);
  doc.fillColor("white");
  doc.fontSize(18).font("Helvetica-Bold").text(title, 48, 22);
  if (subtitle) {
    doc.fontSize(9).font("Helvetica").text(subtitle, 48, 46);
  }
  doc.restore();
  doc.y = 100;
}

function addSectionTitle(doc: PDFKit.PDFDocument, title: string, subtitle?: string) {
  doc.moveDown(1.2);
  doc.fillColor(slate900).font("Helvetica-Bold").fontSize(14).text(title);
  if (subtitle) {
    doc.fillColor(slate500).font("Helvetica").fontSize(9).text(subtitle);
  }
  doc.moveDown(0.5);
}

function drawKeyValue(doc: PDFKit.PDFDocument, label: string, value: string, y: number) {
  doc.fillColor(slate500).font("Helvetica").fontSize(9).text(label, 48, y);
  doc
    .fillColor(slate900)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(value, 200, y - 1);
}

function drawBulletList(doc: PDFKit.PDFDocument, items: string[]) {
  for (const item of items) {
    const lines = splitLines(item, 88);
    doc.fillColor(slate700).font("Helvetica").fontSize(10).text(`• ${lines[0]}`, { indent: 0 });
    for (const line of lines.slice(1)) {
      doc.text(line, { indent: 12 });
    }
    doc.moveDown(0.25);
  }
}

function drawTable(
  doc: PDFKit.PDFDocument,
  columns: Array<{ label: string; width: number; align?: "left" | "right" | "center" }>,
  rows: string[][],
  rowHeight = 22,
) {
  const startX = 48;
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);
  let y = doc.y;

  doc.save();
  doc.fillColor(brandPurpleDark).rect(startX, y, tableWidth, rowHeight).fill();
  doc.fillColor("white").font("Helvetica-Bold").fontSize(9);

  let x = startX;
  for (const column of columns) {
    doc.text(column.label, x + 6, y + 7, {
      width: column.width - 12,
      align: column.align ?? "left",
    });
    x += column.width;
  }

  y += rowHeight;
  doc.fillColor(slate900).font("Helvetica").fontSize(8.5);

  rows.forEach((row, index) => {
    const fillColor = index % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
    doc.rect(startX, y, tableWidth, rowHeight).fillAndStroke(fillColor, slate200);
    let cellX = startX;
    row.forEach((cell, cellIndex) => {
      doc.fillColor(slate900).text(cell, cellX + 6, y + 6, {
        width: columns[cellIndex].width - 12,
        align: columns[cellIndex].align ?? "left",
      });
      cellX += columns[cellIndex].width;
    });
    y += rowHeight;
  });

  doc.restore();
  doc.y = y + 8;
}

function drawPagedTable(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle: string,
  columns: Array<{ label: string; width: number; align?: "left" | "right" | "center" }>,
  rows: string[][],
  options?: {
    rowHeight?: number;
    rowsPerPage?: number;
  },
) {
  const rowHeight = options?.rowHeight ?? 22;
  const rowsPerPage = options?.rowsPerPage ?? 18;

  if (rows.length === 0) {
    addSectionTitle(doc, title, subtitle);
    doc.fillColor(slate500).font("Helvetica").fontSize(10).text("No rows available.");
    return;
  }

  for (let index = 0; index < rows.length; index += rowsPerPage) {
    if (index > 0) {
      doc.addPage();
      addPageHeader(doc, title, subtitle);
    }

    if (index === 0) {
      addSectionTitle(doc, title, subtitle);
    }

    drawTable(doc, columns, rows.slice(index, index + rowsPerPage), rowHeight);
  }
}

function renderSvgChart(
  doc: PDFKit.PDFDocument,
  svg: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  SVGtoPDF(doc, svg, x, y, { width, height });
}

function buildPdf(bundle: ReportBundle): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    ensurePdfkitFontAssets();

    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margin: 48,
      bufferPages: true,
      autoFirstPage: false,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const generatedLabel = bundle.generatedAt.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FBF8FF");
    doc.fillColor(brandPurpleDark).font("Helvetica-Bold").fontSize(12).text("Cipherion", 48, 52);
    doc
      .fillColor(slate500)
      .font("Helvetica")
      .fontSize(9)
      .text("Compliance readiness intelligence", 48, 70);
    doc
      .fillColor(slate900)
      .font("Helvetica-Bold")
      .fontSize(28)
      .text(bundle.reportTitle, 48, 132, { width: 260 });
    doc
      .fillColor(slate700)
      .font("Helvetica")
      .fontSize(12)
      .text(bundle.assessment.organization.productName, 48, 210, {
        width: 260,
      });

    doc.roundedRect(48, 252, 220, 84, 16).fillAndStroke("white", slate200);
    doc.fillColor(slate500).font("Helvetica").fontSize(9).text("Overall readiness", 64, 270);
    doc
      .fillColor(brandPurpleDark)
      .font("Helvetica-Bold")
      .fontSize(28)
      .text(`${bundle.overallScore.toFixed(1)}%`, 64, 286);
    doc.fillColor(slate500).font("Helvetica").fontSize(9).text(bundle.readinessBand, 64, 322);

    doc.roundedRect(48, 354, 220, 84, 16).fillAndStroke("white", slate200);
    drawKeyValue(doc, "Completion", `${bundle.completionPercent.toFixed(1)}%`, 370);
    drawKeyValue(doc, "Risk score", `${bundle.riskSummary.totalRiskScore}`, 392);
    drawKeyValue(doc, "Status", bundle.riskSummary.riskLevel, 414);

    doc.roundedRect(296, 252, 252, 186, 20).fillAndStroke("white", slate200);
    renderSvgChart(doc, buildReadinessChartSvg(bundle.overallScore), 306, 260, 232, 166);

    doc.addPage();
    addPageHeader(doc, "Executive Summary", generatedLabel);
    addSectionTitle(doc, "Narrative overview");
    doc.fillColor(slate700).font("Helvetica").fontSize(11).text(bundle.executiveSummary, {
      width: 498,
      lineGap: 3,
    });

    addSectionTitle(doc, "Key metrics");
    drawTable(
      doc,
      [
        { label: "Metric", width: 240 },
        { label: "Value", width: 120 },
        { label: "Interpretation", width: 188 },
      ],
      [
        [
          "Assessment completion",
          `${bundle.completionPercent.toFixed(1)}%`,
          "Answered / total controls",
        ],
        ["Readiness score", `${bundle.overallScore.toFixed(1)}%`, bundle.readinessBand],
        ["Risk score", `${bundle.riskSummary.totalRiskScore}`, bundle.riskSummary.riskLevel],
        ["High risks open", `${bundle.riskSummary.openHighRisks}`, "Immediate attention needed"],
      ],
      24,
    );

    doc.addPage();
    addPageHeader(doc, "Organization Profile", bundle.assessment.organization.productName);
    addSectionTitle(doc, "Business profile");
    drawKeyValue(doc, "Organization", bundle.assessment.organization.productName, 120);
    drawKeyValue(doc, "Problem solved", bundle.assessment.organization.problemSolved, 142);
    drawKeyValue(doc, "Services", bundle.assessment.organization.services, 164);
    drawKeyValue(doc, "Target customers", bundle.assessment.organization.targetCustomers, 186);
    drawKeyValue(doc, "Regions", bundle.assessment.organization.regions.join(", "), 208);
    drawKeyValue(doc, "Data handled", bundle.assessment.organization.dataHandled.join(", "), 230);

    addSectionTitle(doc, "Assessment context");
    drawBulletList(doc, [
      `Assessment status: ${bundle.assessment.status}`,
      `Created at: ${bundle.assessment.createdAt.toISOString().slice(0, 10)}`,
      bundle.assessment.completedAt
        ? `Completed at: ${bundle.assessment.completedAt.toISOString().slice(0, 10)}`
        : "Completion not yet recorded",
    ]);

    doc.addPage();
    addPageHeader(doc, "Framework Scores", "Weighted scores across the assessment framework set");
    renderSvgChart(doc, buildFrameworkChartSvg(bundle.frameworkScores), 48, 100, 260, 220);
    doc.roundedRect(328, 100, 202, 220, 18).fillAndStroke("white", slate200);
    doc
      .fillColor(slate900)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("Framework score table", 344, 118);
    drawTable(
      doc,
      [
        { label: "Code", width: 66 },
        { label: "Framework", width: 92 },
        { label: "Score", width: 44, align: "right" },
      ],
      bundle.frameworkScores.map((framework) => [
        framework.frameworkCode,
        framework.frameworkName,
        `${framework.score.toFixed(1)}%`,
      ]),
      21,
    );

    doc.addPage();
    addPageHeader(doc, "Risk Summary", "Control status breakdown and open risk concentration");
    addSectionTitle(doc, "Risk overview");
    drawBulletList(doc, [
      `Total risk score: ${bundle.riskSummary.totalRiskScore}`,
      `Open high risks: ${bundle.riskSummary.openHighRisks}`,
      `Open medium risks: ${bundle.riskSummary.openMediumRisks}`,
      `Open low risks: ${bundle.riskSummary.openLowRisks}`,
    ]);

    drawPagedTable(
      doc,
      "Control status breakdown",
      "Control status breakdown and open risk concentration",
      [
        { label: "Control", width: 74 },
        { label: "Framework", width: 74 },
        { label: "Status", width: 78 },
        { label: "Severity", width: 72 },
        { label: "Evidence", width: 58, align: "right" },
        { label: "Risk", width: 52, align: "right" },
      ],
      bundle.controlRows.map((row) => [
        row.code,
        row.frameworkCode,
        row.status.replace(/_/g, " "),
        row.severity,
        `${row.evidenceCount}`,
        `${row.riskScore}`,
      ]),
      { rowHeight: 20, rowsPerPage: 14 },
    );

    doc.addPage();
    addPageHeader(doc, "Evidence Inventory", "Attached evidence coverage by control");
    drawPagedTable(
      doc,
      "Evidence Inventory",
      "Attached evidence coverage by control",
      [
        { label: "Control", width: 72 },
        { label: "Title", width: 190 },
        { label: "Files", width: 44, align: "right" },
        { label: "Risk", width: 52 },
        { label: "Examples", width: 182 },
      ],
      bundle.evidenceRows.map((row) => [
        row.code,
        row.title,
        `${row.count}`,
        row.risk,
        row.examples,
      ]),
      { rowHeight: 22, rowsPerPage: 12 },
    );

    doc.addPage();
    addPageHeader(
      doc,
      "Remediation Recommendations",
      "Priority actions generated from the remaining control gaps",
    );
    const remediationBlockHeight = 76;
    const remediationBottomMargin = 48;
    for (const [index, item] of bundle.remediation.entries()) {
      if (doc.y + remediationBlockHeight > doc.page.height - remediationBottomMargin) {
        doc.addPage();
        addPageHeader(
          doc,
          "Remediation Recommendations",
          "Priority actions generated from the remaining control gaps",
        );
      }

      const boxY = doc.y + 6;
      doc
        .roundedRect(48, boxY, 498, 62, 14)
        .fillAndStroke(index % 2 === 0 ? "#FFFFFF" : "#FAFAFF", slate200);
      doc
        .fillColor(slate900)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(item.title, 62, boxY + 14, { width: 360 });
      doc
        .fillColor(brandPurpleDark)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(item.priority, 454, boxY + 14, {
          width: 72,
          align: "right",
        });
      doc
        .fillColor(slate500)
        .font("Helvetica")
        .fontSize(9)
        .text(`Effort: ${item.effort}`, 62, boxY + 32);
      doc
        .fillColor(slate700)
        .font("Helvetica")
        .fontSize(9)
        .text(item.rationale, 62, boxY + 44, { width: 460 });
      doc.y = boxY + remediationBlockHeight;
    }

    doc.addPage();
    addPageHeader(doc, "Appendix", "Scoring methodology and report generation notes");
    addSectionTitle(doc, "Scoring model");
    drawBulletList(doc, [
      "Compliance status scoring uses weighted controls: compliant = 1, partially compliant = 0.5, non-compliant = 0, and not applicable controls are excluded from the denominator.",
      "Assessment completion is calculated as answered controls divided by total controls.",
      "Readiness is classified as compliant at 80% or above, partially compliant from 50% to 79.9%, and non-compliant below 50%.",
      "Risk scoring weights unresolved controls by severity to surface the most material open items.",
    ]);

    addSectionTitle(doc, "Report metadata");
    drawBulletList(doc, [
      `Generated on: ${generatedLabel}`,
      `Assessment ID: ${bundle.assessment.id}`,
      `Report target: ${bundle.assessment.organization.productName}`,
      `Frameworks included: ${bundle.frameworkScores.map((framework) => framework.frameworkCode).join(", ")}`,
    ]);

    doc.end();
  });
}

export async function generateAssessmentReport(
  context: ReportRequestContext,
): Promise<GeneratedReportSummary> {
  const bundle = await measureReportStep("bundle", () => buildReportBundle(context));
  const pdfBuffer = await measureReportStep("buildPdf", () => buildPdf(bundle));

  const upload = await measureReportStep("uploadFileToStorage", () =>
    uploadFileToStorage(
      {
        buffer: pdfBuffer,
        mimeType: "application/pdf",
        originalName: `cipherion-report-${context.assessmentId}.pdf`,
      },
      { keyPrefix: "reports" },
    ),
  );

  const report = await measureReportStep("prisma.report.create", () =>
    prisma.report.create({
      data: {
        assessmentId: context.assessmentId,
        type: "COMPLIANCE_READINESS",
        format: "PDF",
        fileUrl: upload.url,
      },
      select: {
        id: true,
        assessmentId: true,
        fileUrl: true,
        generatedAt: true,
      },
    }),
  );

  const typedReport = report as {
    id: string;
    assessmentId: string;
    fileUrl: string | null;
    generatedAt: Date;
  };

  return {
    reportId: typedReport.id,
    assessmentId: typedReport.assessmentId,
    fileUrl: typedReport.fileUrl ?? upload.url,
    generatedAt: typedReport.generatedAt.toISOString(),
    score: bundle.overallScore,
    completionPercent: roundPercent(bundle.completionPercent),
    frameworkScores: bundle.frameworkScores,
  };
}

export async function getLatestReportForAssessment(context: ReportRequestContext) {
  return await prisma.report.findFirst({
    where: {
      assessmentId: context.assessmentId,
      assessment: {
        userId: context.userId,
      },
    },
    orderBy: {
      generatedAt: "desc",
    },
    select: {
      id: true,
      assessmentId: true,
      type: true,
      format: true,
      fileUrl: true,
      generatedAt: true,
    },
  });
}

export function getStorageKeyFromReportUrl(fileUrl: string): string | null {
  return extractStorageKeyFromUrl(fileUrl);
}
