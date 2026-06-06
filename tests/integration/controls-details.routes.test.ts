import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    control: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}));

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/controls/[id]/details/route";

describe("Controls details API route", () => {
  const session = { user: { id: "user_1", role: "USER" as const } };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHelpers.requireAuth).mockResolvedValue(session as never);
  });

  it("returns control details with related controls", async () => {
    vi.mocked(prisma.control.findUnique).mockResolvedValue({
      id: "ctrl_1",
      frameworkId: "fw_1",
      description: "A control",
      metadata: { foo: "bar" },
      gatewayDependencies: [
        {
          id: "dep_1",
          parentControlId: "ctrl_1",
          childControlId: "ctrl_2",
          triggerValue: "FAIL",
          effect: "BLOCK",
          childControl: {
            id: "ctrl_2",
            frameworkId: "fw_1",
            code: "C-2",
            title: "Child",
            description: "d",
            category: "Cat",
          },
          parentControl: {
            id: "ctrl_1",
            frameworkId: "fw_1",
            code: "C-1",
            title: "Parent",
            description: "d",
            category: "Cat",
          },
        },
      ],
      subDependencies: [
        {
          id: "dep_2",
          parentControlId: "ctrl_3",
          childControlId: "ctrl_1",
          triggerValue: "PASS",
          effect: "ALLOW",
          childControl: {
            id: "ctrl_1",
            frameworkId: "fw_1",
            code: "C-1",
            title: "Parent",
            description: "d",
            category: "Cat",
          },
          parentControl: {
            id: "ctrl_3",
            frameworkId: "fw_1",
            code: "C-3",
            title: "Grandparent",
            description: "d",
            category: "Cat",
          },
        },
      ],
    } as never);

    vi.mocked(prisma.control.findMany).mockResolvedValue([
      {
        id: "ctrl_4",
        frameworkId: "fw_1",
        code: "C-4",
        title: "Related 1",
        description: "d",
        category: "Cat",
      },
    ] as never);

    const req = new Request("http://localhost/api/controls/ctrl_1/details");
    const res = (await GET(req, { params: { id: "ctrl_1" } })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe("ctrl_1");
    expect(json.data.description).toBe("A control");
    expect(json.data.relatedControls.length).toBeGreaterThan(0);
  });

  it("returns 404 when control not found", async () => {
    vi.mocked(prisma.control.findUnique).mockResolvedValue(null);

    const req = new Request("http://localhost/api/controls/missing/details");
    const res = (await GET(req, { params: { id: "missing" } })) as Response;
    expect(res.status).toBe(404);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(authHelpers.requireAuth).mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/controls/ctrl_1/details");
    const res = (await GET(req, { params: { id: "ctrl_1" } })) as Response;
    expect(res.status).toBe(401);
  });
});
