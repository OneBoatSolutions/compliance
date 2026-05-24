import { FrameworkStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { FrameworkListQuery } from "@/lib/validations/framework";

const frameworkListSelect = {
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
  _count: { select: { controls: true } },
} as const;

function buildFrameworkWhere(query: FrameworkListQuery): Prisma.FrameworkWhereInput {
  const search = query.search?.trim();

  return {
    ...(query.region ? { region: query.region } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { code: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function listFrameworks(query: FrameworkListQuery) {
  const { page, limit } = query;
  const where = buildFrameworkWhere(query);
  const skip = (page - 1) * limit;

  const [items, total, statusCounts] = await Promise.all([
    prisma.framework.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: frameworkListSelect,
    }),
    prisma.framework.count({ where }),
    prisma.framework.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const counts = {
    draft: 0,
    published: 0,
    archived: 0,
  };

  for (const row of statusCounts) {
    if (row.status === FrameworkStatus.DRAFT) {
      counts.draft = row._count.status;
    } else if (row.status === FrameworkStatus.PUBLISHED) {
      counts.published = row._count.status;
    } else if (row.status === FrameworkStatus.ARCHIVED) {
      counts.archived = row._count.status;
    }
  }

  return {
    items,
    meta: { total, page, limit, totalPages },
    counts,
  };
}
