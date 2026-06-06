import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { listFrameworks } from "@/services/framework-admin-service";

describe("framework-admin-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseQuery = { page: 1, limit: 20 };

  it("returns paginated framework list with status counts", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      { id: "fw1", code: "GDPR", name: "GDPR", status: "PUBLISHED", _count: { controls: 10 } },
      { id: "fw2", code: "HIPAA", name: "HIPAA", status: "DRAFT", _count: { controls: 5 } },
    ] as never);
    vi.mocked(prisma.framework.count).mockResolvedValue(2);
    vi.mocked(prisma.framework.groupBy).mockResolvedValue([
      { status: "PUBLISHED", _count: { status: 1 } },
      { status: "DRAFT", _count: { status: 1 } },
    ] as never);

    const result = await listFrameworks(baseQuery);
    expect(result.items).toHaveLength(2);
    expect(result.meta.total).toBe(2);
    expect(result.meta.totalPages).toBe(1);
    expect(result.counts.published).toBe(1);
    expect(result.counts.draft).toBe(1);
    expect(result.counts.archived).toBe(0);
  });

  it("applies search filter across name, code, and category", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.framework.count).mockResolvedValue(0);
    vi.mocked(prisma.framework.groupBy).mockResolvedValue([] as never);

    await listFrameworks({ ...baseQuery, search: "GDPR" });
    const callArgs = vi.mocked(prisma.framework.findMany).mock.calls[0][0];
    expect(callArgs).toBeDefined();
    if (callArgs) {
      const where = callArgs.where as Record<string, unknown>;
      expect(where.OR).toBeDefined();
    }
  });

  it("filters by region, category, and status", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.framework.count).mockResolvedValue(0);
    vi.mocked(prisma.framework.groupBy).mockResolvedValue([] as never);

    await listFrameworks({ ...baseQuery, region: "EU", category: "Privacy", status: "PUBLISHED" });
    const callArgs = vi.mocked(prisma.framework.findMany).mock.calls[0][0];
    expect(callArgs).toBeDefined();
    if (callArgs) {
      const where = callArgs.where as Record<string, unknown>;
      expect(where.region).toBe("EU");
      expect(where.category).toBe("Privacy");
      expect(where.status).toBe("PUBLISHED");
    }
  });
});
