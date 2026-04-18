import { Prisma } from "@prisma/client";

import { withErrorHandler } from "@/lib/api-handler";
import { notFoundResponse, successResponse, validationErrorResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { assessmentItemsListQuerySchema } from "@/lib/validations/assessment";

interface RouteContext {
  params: {
    id: string;
  };
}

function parseListParam(searchParams: URLSearchParams, key: string): string[] {
  const entries = searchParams.getAll(key);

  const values = entries.flatMap((entry) =>
    entry
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0),
  );

  return [...new Set(values)];
}

function buildOrderBy(sortBy: string, sortOrder: Prisma.SortOrder) {
  if (sortBy === "updatedAt") {
    return [{ updatedAt: sortOrder } satisfies Prisma.AssessmentItemOrderByWithRelationInput];
  }

  if (sortBy === "createdAt") {
    return [{ createdAt: sortOrder } satisfies Prisma.AssessmentItemOrderByWithRelationInput];
  }

  if (sortBy === "status") {
    return [
      { status: sortOrder } satisfies Prisma.AssessmentItemOrderByWithRelationInput,
      { updatedAt: "desc" } satisfies Prisma.AssessmentItemOrderByWithRelationInput,
    ];
  }

  if (sortBy === "code") {
    return [
      { control: { code: sortOrder } } satisfies Prisma.AssessmentItemOrderByWithRelationInput,
      { updatedAt: "desc" } satisfies Prisma.AssessmentItemOrderByWithRelationInput,
    ];
  }

  // Severity uses enum declaration order (LOW, MEDIUM, HIGH, CRITICAL).
  // Descending returns CRITICAL first, then HIGH, MEDIUM, LOW.
  return [
    { control: { severity: sortOrder } } satisfies Prisma.AssessmentItemOrderByWithRelationInput,
    { updatedAt: "desc" } satisfies Prisma.AssessmentItemOrderByWithRelationInput,
  ];
}

export const GET = withErrorHandler(async (req: Request, { params }: RouteContext) => {
  const session = await requireAuth();
  const { id: assessmentId } = params;

  const ownedAssessment = await prisma.assessment.findFirst({
    where: {
      id: assessmentId,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!ownedAssessment) {
    return notFoundResponse("Assessment not found");
  }

  const url = new URL(req.url);
  const raw = {
    page: url.searchParams.get("page") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    status: parseListParam(url.searchParams, "status"),
    framework: parseListParam(url.searchParams, "framework"),
    severity: parseListParam(url.searchParams, "severity"),
    search: url.searchParams.get("search") ?? undefined,
    sortBy: url.searchParams.get("sortBy") ?? undefined,
    sortOrder: url.searchParams.get("sortOrder") ?? undefined,
  };
  const parsed = assessmentItemsListQuerySchema.safeParse(raw);

  if (!parsed.success) {
    return validationErrorResponse(parsed.error.format());
  }

  const { page, limit, status, framework, severity, search, sortBy, sortOrder } = parsed.data;

  const where: Prisma.AssessmentItemWhereInput = {
    assessmentId,
    ...(search
      ? {
          OR: [
            {
              comments: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              control: {
                code: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              control: {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),
  };

  if (status.length === 1) {
    where.status = status[0];
  } else if (status.length > 1) {
    where.status = {
      in: status,
    };
  }

  const controlWhere: Prisma.ControlWhereInput = {};

  if (framework.length === 1) {
    controlWhere.frameworkId = framework[0];
  } else if (framework.length > 1) {
    controlWhere.frameworkId = {
      in: framework,
    };
  }

  if (severity.length === 1) {
    controlWhere.severity = severity[0];
  } else if (severity.length > 1) {
    controlWhere.severity = {
      in: severity,
    };
  }

  if (Object.keys(controlWhere).length > 0) {
    where.control = controlWhere;
  }

  const skip = (page - 1) * limit;
  const orderBy = buildOrderBy(sortBy, sortOrder);

  const [items, total] = await Promise.all([
    prisma.assessmentItem.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        status: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            evidence: true,
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
    }),
    prisma.assessmentItem.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return successResponse({
    items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});
