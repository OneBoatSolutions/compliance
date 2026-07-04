import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildReportBundle, generateReportPDF } from "@/services/report-service";
import { uploadFileToStorage, generateSignedDownloadUrl } from "@/services/storage-service";
import { invalidateDashboardCache } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    assessmentId: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assessmentId } = await context.params;
    if (!assessmentId) {
      return NextResponse.json({ error: "Invalid assessment ID" }, { status: 400 });
    }

    // Check if the assessment belongs to the user
    const assessment = await prisma.assessment.findFirst({
      where: {
        id: assessmentId,
        userId: session.user.id,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Build the bundle (runs AI executive summary narrative if key is active, or falls back to local layout)
    const bundle = await buildReportBundle({
      assessmentId,
      userId: session.user.id,
    });

    // Generate the PDF using PDFKit
    const pdfBuffer = await generateReportPDF(bundle);

    // Save/upload to storage service
    const uploaded = await uploadFileToStorage(
      {
        buffer: pdfBuffer,
        mimeType: "application/pdf",
        originalName: `compliance-readiness-report-${assessmentId}.pdf`,
      },
      {
        keyPrefix: "reports",
      },
    );

    // Create Report record in Prisma
    const report = await prisma.report.create({
      data: {
        assessmentId,
        type: "COMPLIANCE_READINESS",
        format: "PDF",
        fileUrl: uploaded.url,
      },
    });

    // Invalidate dashboard metrics cache (since reports generated count has changed!)
    await invalidateDashboardCache(session.user.id);

    // Generate signed download URL immediately inside successful response (single handshake)
    const key = uploaded.key;
    const signedUrl = await generateSignedDownloadUrl(key);

    return NextResponse.json(
      {
        success: true,
        fileUrl: signedUrl,
        reportId: report.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
