import { Prisma } from "@prisma/client";
import { unstable_cache, revalidateTag } from "next/cache";
import { withErrorHandler } from "@/lib/api-handler";
import {
  errorResponse,
  notFoundResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateFrameworkAdminSchema } from "@/lib/validations/framework";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const getCachedFramework = unstable_cache(
  async (id: string) => {
    return prisma.framework.findUnique({
      where: { id },
      include: {
        controls: {
          orderBy: { code: "asc" },
          select: {
            id: true,
            frameworkId: true,
            code: true,
            title: true,
            description: true,
            category: true,
            severity: true,
            weight: true,
            createdAt: true,
            updatedAt: true,
            // metadata and isGateway are intentionally omitted:
            // metadata is a raw JSON blob not rendered in the admin UI.
            // isGateway is a server-only scoring flag not surfaced to admins.
          },
        },
      },
    });
  },
  ["framework-controls"],
  {
    revalidate: 300,
    tags: ["controls"],
  },
);

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  await requireAdmin();
  const { id } = await params;

  const framework = await getCachedFramework(id);

  if (!framework) {
    return notFoundResponse("Framework not found");
  }

  return successResponse(framework);
});

export const PATCH = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  await requireAdmin();
  const { id } = await params;

  const existing = await prisma.framework.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) {
    return notFoundResponse("Framework not found");
  }

  const body = await req.json();
  const parsed = updateFrameworkAdminSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const data = parsed.data;
  // Allow only archive transition for published frameworks
  if (existing.status === "PUBLISHED" && data.status !== "ARCHIVED") {
    return errorResponse(
      "Published frameworks cannot be edited. Create a new version instead.",
      403,
    );
  }
  const updateData: Prisma.FrameworkUpdateInput = {};

  if (data.code !== undefined) {
    updateData.code = data.code;
  }
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.description !== undefined) {
    updateData.description = data.description;
  }
  if (data.region !== undefined) {
    updateData.region = data.region;
  }
  if (data.category !== undefined) {
    updateData.category = data.category;
  }
  if (data.version !== undefined) {
    updateData.version = data.version;
  }
  if (data.effectiveDate !== undefined) {
    updateData.effectiveDate = data.effectiveDate;
  }
  if (data.sourceLink !== undefined) {
    updateData.sourceLink = data.sourceLink === "" ? null : data.sourceLink;
  }
  if (data.status !== undefined) {
    updateData.status = data.status;
  }
  if (data.publishedAt !== undefined) {
    updateData.publishedAt = data.publishedAt;
  }

  try {
    const updated = await prisma.framework.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        region: true,
        category: true,
        version: true,
        effectiveDate: true,
        sourceLink: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidateTag("frameworks");
    revalidateTag("controls");
    revalidateTag("dashboard");

    return successResponse(updated);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return errorResponse("A framework with this code already exists", 409);
    }
    throw e;
  }
});

export const DELETE = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  void req;
  await requireAdmin();
  const { id } = await params;

  const existing = await prisma.framework.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return notFoundResponse("Framework not found");
  }

  const inUse = await prisma.assessmentItem.count({
    where: { control: { frameworkId: id } },
  });

  if (inUse > 0) {
    return errorResponse(
      "Cannot delete framework: it is referenced by one or more assessments",
      409,
    );
  }

  await prisma.framework.delete({
    where: { id },
  });

  revalidateTag("frameworks");
  revalidateTag("controls");
  revalidateTag("dashboard");

  return successResponse({ deleted: true });
});
