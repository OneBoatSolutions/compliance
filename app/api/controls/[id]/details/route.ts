import { withErrorHandler } from "@/lib/api-handler";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { successResponse, notFoundResponse } from "@/lib/api-helpers";

interface ControlRecord {
  id: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string;
  category: string | null;
}

interface ControlDependencyRecord {
  id: string;
  parentControlId: string;
  childControlId: string;
  triggerValue: string;
  effect: string;
  childControl: ControlRecord;
  parentControl: ControlRecord;
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAuth();
  const { id } = await params;

  const control = await prisma.control.findUnique({
    where: { id },
    include: {
      gatewayDependencies: {
        include: { childControl: true },
      },
      subDependencies: {
        include: { parentControl: true },
      },
    },
  });

  if (!control) {
    return notFoundResponse("Control not found");
  }

  // Find related controls in the same category
  const relatedControls = await prisma.control.findMany({
    where: {
      frameworkId: control.frameworkId,
      category: control.category,
      id: { not: control.id },
    },
    take: 5,
  });

  // Combine dependencies and category-related controls
  const related = [
    ...control.gatewayDependencies.map((d: ControlDependencyRecord) => ({
      id: d.childControl.id,
      code: d.childControl.code,
      title: d.childControl.title,
      type: "dependency",
    })),
    ...control.subDependencies.map((d: ControlDependencyRecord) => ({
      id: d.parentControl.id,
      code: d.parentControl.code,
      title: d.parentControl.title,
      type: "parent",
    })),
    ...relatedControls.map((c: ControlRecord) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      type: "related",
    })),
  ];

  // Deduplicate by ID
  const uniqueRelated = Array.from(new Map(related.map((item) => [item.id, item])).values());

  return successResponse({
    id: control.id,
    description: control.description,
    metadata: control.metadata,
    relatedControls: uniqueRelated,
  });
});
