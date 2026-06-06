import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}));

vi.mock("@/lib/dashboard-data", () => ({
  getCachedDashboardData: vi.fn(),
}));

import { GET } from "@/app/api/dashboard/route";
import * as authHelpers from "@/lib/auth-helpers";
import * as dashboardData from "@/lib/dashboard-data";
import type { DashboardApiData } from "@/types/dashboard";

const mockDashboardPayload: DashboardApiData = {
  totalAssessments: 1,
  averageScore: 85,
  criticalGaps: 2,
  reportsGenerated: 0,
  recentActivity: [],
  assessments: [],
};

const dashboardReq = () => new Request("http://localhost/api/dashboard");

describe("Dashboard API", () => {
  const session = { user: { id: "user_1", role: "USER" as const } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
    vi.mocked(dashboardData.getCachedDashboardData).mockResolvedValue(mockDashboardPayload);
  });

  it("returns dashboard data for authenticated user", async () => {
    const res = (await GET(dashboardReq())) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.totalAssessments).toBe(1);
    expect(json.data.averageScore).toBe(85);
    expect(dashboardData.getCachedDashboardData).toHaveBeenCalledWith("user_1");
  });

  it("returns 401 when not authenticated", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const res = (await GET(dashboardReq())) as Response;

    expect(res.status).toBe(401);
  });
});
