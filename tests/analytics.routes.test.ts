import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}));

vi.mock("@/lib/analytics-data", () => ({
  getCachedAnalyticsData: vi.fn(),
}));

import { GET } from "@/app/api/analytics/route";
import * as analyticsData from "@/lib/analytics-data";
import * as authHelpers from "@/lib/auth-helpers";
import type { AnalyticsApiData } from "@/types/analytics";

const payload: AnalyticsApiData = {
  trend: [],
  frameworkComparison: [],
  statusDistribution: [],
  categoryCompletion: [],
  riskHeatmap: [],
  remediationProgress: {
    totalSteps: 4,
    completedSteps: 2,
    activePlans: 1,
    completionRate: 50,
  },
};

describe("Analytics API", () => {
  const session = { user: { id: "user_1", role: "USER" as const } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
    vi.mocked(analyticsData.getCachedAnalyticsData).mockResolvedValue(payload);
  });

  it("supports strict custom date ranges", async () => {
    const res = (await GET(
      new Request("http://localhost/api/analytics?startDate=2026-01-01&endDate=2026-01-31"),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(analyticsData.getCachedAnalyticsData).toHaveBeenCalledWith(
      "user_1",
      "CUSTOM",
      "2026-01-01",
      "2026-01-31",
    );
  });

  it("rejects incomplete custom ranges", async () => {
    const res = (await GET(
      new Request("http://localhost/api/analytics?startDate=2026-01-01"),
    )) as Response;

    expect(res.status).toBe(400);
  });
});
