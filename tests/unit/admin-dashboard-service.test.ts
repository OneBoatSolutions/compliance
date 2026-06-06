import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { count: vi.fn() },
    framework: { count: vi.fn() },
    assessment: { count: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { getAdminDashboardStats } from "@/services/admin-dashboard-service";

describe("admin-dashboard-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns aggregated counts", async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(10);
    vi.mocked(prisma.framework.count)
      .mockResolvedValueOnce(5) // PUBLISHED
      .mockResolvedValueOnce(3); // DRAFT
    vi.mocked(prisma.assessment.count).mockResolvedValue(25);

    const stats = await getAdminDashboardStats();
    expect(stats).toEqual({
      totalUsers: 10,
      publishedFrameworks: 5,
      draftFrameworks: 3,
      totalAssessments: 25,
    });
  });

  it("returns zero counts when database is empty", async () => {
    vi.mocked(prisma.user.count).mockResolvedValue(0);
    vi.mocked(prisma.framework.count).mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    vi.mocked(prisma.assessment.count).mockResolvedValue(0);

    const stats = await getAdminDashboardStats();
    expect(stats).toEqual({
      totalUsers: 0,
      publishedFrameworks: 0,
      draftFrameworks: 0,
      totalAssessments: 0,
    });
  });
});
