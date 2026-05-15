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

    // Serialize the response (convert Date objects to ISO strings)
    const response = {
      reportTitle: bundle.reportTitle,
      generatedAt: bundle.generatedAt.toISOString(),
      overallScore: bundle.overallScore,
      completionPercent: bundle.completionPercent,
      readinessBand: bundle.readinessBand,
      executiveSummary: bundle.executiveSummary,
      frameworkScores: bundle.frameworkScores,
      riskSummary: bundle.riskSummary,
      remediation: bundle.remediation,
      controlRows: bundle.controlRows,
      evidenceRows: bundle.evidenceRows,
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
