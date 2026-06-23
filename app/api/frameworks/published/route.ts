import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/frameworks/published
 *
 * User-readable endpoint that returns all PUBLISHED frameworks.
 * Used by the framework selection page for manual add/search.
 */
export const GET = withErrorHandler(async (req: Request) => {
  await requireAuth();

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim() ?? "";

  const where = {
    status: "PUBLISHED" as const,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { code: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const frameworks = await prisma.framework.findMany({
    where,
    orderBy: { name: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      region: true,
      category: true,
      version: true,
      _count: { select: { controls: true } },
    },
  });

  return successResponse(frameworks, 200, {
    "Cache-Control": "public, max-age=300, s-maxage=600",
  });
});
