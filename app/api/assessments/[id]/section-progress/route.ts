import { withErrorHandler } from "@/lib/api-handler";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-helpers";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAuth();
  const { id } = await params;
  const url = new URL(req.url);
  const controlId = url.searchParams.get("controlId");

  if (!controlId) {
    throw new Error("Missing controlId");
  }

  // Get the control to find its framework and category
  const targetControl = await prisma.control.findUnique({
    where: { id: controlId },
    select: { frameworkId: true, category: true },
  });

  if (!targetControl) {
    throw new Error("Control not found");
  }

  // Query assessment items in this assessment for the same framework and category
  const items = await prisma.assessmentItem.findMany({
    where: {
      assessmentId: id,
      control: {
        frameworkId: targetControl.frameworkId,
        category: targetControl.category,
      },
    },
    select: {
      status: true,
    },
  });

  let compliant = 0;
  let partiallyCompliant = 0;
  let nonCompliant = 0;
  let notStarted = 0;

  for (const item of items) {
    switch (item.status) {
      case "COMPLIANT":
        compliant++;
        break;
      case "PARTIALLY_COMPLIANT":
        partiallyCompliant++;
        break;
      case "NOT_COMPLIANT":
        nonCompliant++;
        break;
      default:
        notStarted++;
    }
  }

  return successResponse({
    total: items.length,
    compliant,
    partiallyCompliant,
    nonCompliant,
    notStarted,
  });
});
