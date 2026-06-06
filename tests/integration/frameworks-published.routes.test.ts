import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    framework: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}));

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/frameworks/published/route";

describe("Frameworks published API route", () => {
  const session = { user: { id: "user_1", role: "USER" as const } };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHelpers.requireAuth).mockResolvedValue(session as never);
  });

  it("returns all published frameworks", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([
      {
        id: "fw_1",
        code: "GDPR",
        name: "GDPR",
        description: "Privacy",
        region: "EU",
        category: "Privacy",
        version: "1.0.0",
        _count: { controls: 24 },
      },
    ] as never);

    const req = new Request("http://localhost/api/frameworks/published");
    const res = (await GET(req)) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].code).toBe("GDPR");
    expect(prisma.framework.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "PUBLISHED" }),
        orderBy: { name: "asc" },
      }),
    );
  });

  it("applies search filter", async () => {
    vi.mocked(prisma.framework.findMany).mockResolvedValue([] as never);

    const req = new Request("http://localhost/api/frameworks/published?search=privacy");
    await GET(req);

    expect(prisma.framework.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "PUBLISHED",
          OR: expect.arrayContaining([
            expect.objectContaining({ name: { contains: "privacy", mode: "insensitive" } }),
          ]),
        }),
      }),
    );
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(authHelpers.requireAuth).mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/frameworks/published");
    const res = (await GET(req)) as Response;
    expect(res.status).toBe(401);
  });
});
