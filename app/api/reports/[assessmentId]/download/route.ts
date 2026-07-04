import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSignedDownloadUrl, extractStorageKeyFromUrl } from "@/services/storage-service";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    assessmentId: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assessmentId } = await context.params;
    if (!assessmentId) {
      return NextResponse.json({ error: "Invalid assessment ID" }, { status: 400 });
    }

    // Find the latest PDF report for this assessment owned by the user
    const report = await prisma.report.findFirst({
      where: {
        assessmentId,
        format: "PDF",
        assessment: {
          userId: session.user.id,
        },
      },
      orderBy: {
        generatedAt: "desc",
      },
    });

    if (!report || !report.fileUrl) {
      return NextResponse.json({ error: "No generated report found" }, { status: 404 });
    }

    const key = extractStorageKeyFromUrl(report.fileUrl);
    if (!key) {
      return NextResponse.json({ error: "Failed to extract storage key" }, { status: 500 });
    }

    const signedUrl = await generateSignedDownloadUrl(key);

    return NextResponse.json({
      success: true,
      url: signedUrl,
    });
  } catch (error) {
    console.error("Error retrieving report download link:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
