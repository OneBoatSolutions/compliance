import { FrameworkStatus, Prisma } from "@prisma/client";
import { withErrorHandler } from "@/lib/api-handler";
import { errorResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createFrameworkAdminSchema, frameworkListQuerySchema } from "@/lib/validations/framework";
import { listFrameworks } from "@/services/framework-admin-service";

export const GET = withErrorHandler(async (req: Request) => {
  await requireAdmin();

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = frameworkListQuerySchema.safeParse(raw);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const result = await listFrameworks(parsed.data);

  return successResponse({
    items: result.items,
    meta: result.meta,
  });
});

export const POST = withErrorHandler(async (req: Request) => {
  await requireAdmin();

  const body = await req.json();
  const parsed = createFrameworkAdminSchema.safeParse(body);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const data = parsed.data;

  try {
    const created = await prisma.framework.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description ?? "",
        region: data.region ?? "",
        category: data.category ?? "",
        version: data.version ?? "1.0.0",
        effectiveDate: data.effectiveDate ?? new Date(),
        sourceLink:
          data.sourceLink === undefined || data.sourceLink === "" ? null : data.sourceLink,
        status: FrameworkStatus.DRAFT,
      },
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

    return successResponse(created, 201);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return errorResponse("A framework with this code already exists", 409);
    }
    throw e;
  }
});
