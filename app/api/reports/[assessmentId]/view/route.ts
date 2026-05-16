import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buildReportBundle } from "@/services/report-service";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    assessmentId: string;
  }>;
}

interface ControlRow {
  code: string;
  severity: string;
  status: string;
  riskScore: number;
  title: string;
}

interface RemediationItem {
  title: string;
}

function buildFindings(controlRows: ControlRow[]): Array<{ type: string; text: string }> {
  const compliant = controlRows.filter((r) => r.status === "COMPLIANT").length;
  const partial = controlRows.filter((r) => r.status === "PARTIALLY_COMPLIANT").length;
  const nonCompliant = controlRows.filter((r) => r.status === "NOT_COMPLIANT").length;
  const critical = controlRows.filter((r) => r.severity === "CRITICAL").length;

  const findings: Array<{ type: string; text: string }> = [];

  // Success finding
  if (compliant > 0) {
    findings.push({
      type: "success",
      text: `${compliant} controls fully implemented and operational`,
    });
  }

  // Warning findings
  if (critical > 0) {
    findings.push({
      type: "warning",
      text: `${critical} critical controls require immediate attention`,
    });
  }

  if (nonCompliant > 0) {
    findings.push({
      type: "warning",
      text: `${nonCompliant} controls are non-compliant and need remediation`,
    });
  }

  // Info finding
  if (partial > 0) {
    findings.push({
      type: "info",
      text: `${partial} controls partially implemented - gaps identified`,
    });
  }

  // Insight finding
  if (compliant > nonCompliant && partial > 0) {
    findings.push({
      type: "insight",
      text: "Strong compliance foundation with focused remediation opportunities",
    });
  }

  return findings.slice(0, 5); // Return max 5 findings
}

// Build critical alerts
function buildAlerts(
  riskSummary: {
    totalRiskScore: number;
    openHighRisks: number;
    openMediumRisks: number;
    openLowRisks: number;
  },
  controlRows: ControlRow[],
): Array<{ title: string; description: string }> {
  const alerts: Array<{ title: string; description: string }> = [];

  // Critical control alert
  const criticalControls = controlRows.filter((r) => r.severity === "CRITICAL");
  if (criticalControls.length > 0) {
    alerts.push({
      title: "Critical Controls Require Attention",
      description: `${criticalControls.length} critical control(s) identified. Immediate remediation required to reduce compliance risk.`,
    });
  }

  // High-risk alert
  if (riskSummary.openHighRisks > 0) {
    alerts.push({
      title: "High-Risk Controls",
      description: `${riskSummary.openHighRisks} high-risk control(s) with non-compliant status. Prioritize remediation to strengthen security posture.`,
    });
  }

  // Overall risk level alert
  if (riskSummary.totalRiskScore >= 20) {
    alerts.push({
      title: "Overall Risk Level: High",
      description:
        "Your organization has significant compliance gaps. Develop prioritized remediation roadmap to reduce risk exposure.",
    });
  } else if (riskSummary.totalRiskScore >= 10) {
    alerts.push({
      title: "Overall Risk Level: Medium",
      description:
        "Multiple compliance gaps identified. Implement targeted remediation plan to achieve compliance objectives.",
    });
  }

  return alerts;
}

// Build risk distribution by severity
function buildDistribution(controlRows: ControlRow[]): {
  critical: number;
  high: number;
  medium: number;
  low: number;
} {
  return {
    critical: controlRows.filter((r) => r.severity === "CRITICAL").length,
    high: controlRows.filter((r) => r.severity === "HIGH").length,
    medium: controlRows.filter((r) => r.severity === "MEDIUM").length,
    low: controlRows.filter((r) => r.severity === "LOW").length,
  };
}

// Build risk heatmap (Severity × Status matrix)
function buildHeatmap(
  controlRows: ControlRow[],
): Array<{ severity: string; status: string; count: number }> {
  const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  const statusOrder = ["NOT_COMPLIANT", "PARTIALLY_COMPLIANT", "COMPLIANT"];
  const heatmapMap = new Map<string, number>();

  for (const row of controlRows) {
    const key = `${row.severity}:${row.status}`;
    heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
  }

  const heatmap: Array<{ severity: string; status: string; count: number }> = [];
  for (const severity of severityOrder) {
    for (const status of statusOrder) {
      const key = `${severity}:${status}`;
      const count = heatmapMap.get(key) || 0;
      if (count > 0) {
        heatmap.push({ severity, status, count });
      }
    }
  }

  return heatmap;
}

// Extract critical risks list
function buildCriticalRisks(
  controlRows: ControlRow[],
): Array<{ code: string; title: string; severity: string; status: string }> {
  return controlRows
    .filter((r) => r.severity === "CRITICAL")
    .map((r) => ({
      code: r.code,
      title: r.title,
      severity: r.severity,
      status: r.status,
    }))
    .slice(0, 10); // Top 10 critical risks
}

// Extract top recommendations from remediation
function buildTopRecommendations(remediation: RemediationItem[]): Array<{ title: string }> {
  return remediation.slice(0, 5).map((item) => ({ title: item.title }));
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Auth validation
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assessmentId } = await context.params;

    if (!assessmentId || typeof assessmentId !== "string") {
      return NextResponse.json({ error: "Invalid assessment ID" }, { status: 400 });
    }

    // Build the report bundle (reuses all existing logic)
    const bundle = await buildReportBundle({
      assessmentId,
      userId: session.user.id,
    });

    // Calculate derived data for report visualization
    const findings = buildFindings(bundle.controlRows);
    const alerts = buildAlerts(bundle.riskSummary, bundle.controlRows);
    const distribution = buildDistribution(bundle.controlRows);
    const heatmap = buildHeatmap(bundle.controlRows);
    const criticalRisks = buildCriticalRisks(bundle.controlRows);
    const topRecommendations = buildTopRecommendations(bundle.remediation);

    // Serialize the response (convert Date objects to ISO strings)
    const response = {
      reportTitle: bundle.reportTitle,
      generatedAt: bundle.generatedAt.toISOString(),
      overallScore: bundle.overallScore,
      completionPercent: bundle.completionPercent,
      readinessBand: bundle.readinessBand,
      executiveSummary: bundle.executiveSummary,
      // Executive summary data
      findings,
      alerts,
      criticalRisksCount: criticalRisks.length,
      criticalRisks,
      topRecommendations,
      // Risk analysis data
      frameworkScores: bundle.frameworkScores,
      riskSummary: bundle.riskSummary,
      distribution,
      heatmap,
      // Control and evidence data
      remediation: bundle.remediation,
      controlRows: bundle.controlRows,
      evidenceRows: bundle.evidenceRows,
      // Organization and assessment metadata
      organization: {
        id: bundle.assessment.organization.id,
        productName: bundle.assessment.organization.productName,
        description: bundle.assessment.organization.description,
        services: bundle.assessment.organization.services,
        targetCustomers: bundle.assessment.organization.targetCustomers,
        problemSolved: bundle.assessment.organization.problemSolved,
        dataHandled: bundle.assessment.organization.dataHandled,
        regions: bundle.assessment.organization.regions,
      },
      assessment: {
        id: bundle.assessment.id,
        status: bundle.assessment.status,
        score: bundle.assessment.score,
        createdAt: bundle.assessment.createdAt.toISOString(),
        completedAt: bundle.assessment.completedAt?.toISOString() ?? null,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.startsWith("404:")) {
        return NextResponse.json(
          { error: "Assessment not found or access denied" },
          { status: 404 },
        );
      }
    }

    console.error("Error generating report view:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
