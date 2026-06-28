import { unstable_cache } from "next/cache";
import { withErrorHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-helpers";
import { requireAuth } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const getCachedPublishedFrameworks = unstable_cache(
  async (search: string) => {
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

    return prisma.framework.findMany({
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
  },
  ["published-frameworks"],
  {
    revalidate: 300,
    tags: ["frameworks"],
  },
);

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

  const frameworks = await getCachedPublishedFrameworks(search);

  return successResponse(frameworks);
});
