import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    assessment: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth-helpers", () => ({
  requireAuth: vi.fn(),
}));

import * as authHelpers from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  GET as getAssessmentById,
  DELETE as deleteAssessment,
} from "@/app/api/assessments/[id]/route";

describe("Assessment by id API route: GET + DELETE", () => {
  const session = { user: { id: "user_1", role: "USER" as const } };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHelpers.requireAuth).mockResolvedValue(session as never);
  });

  describe("GET /api/assessments/[id]", () => {
    it("returns full assessment with items, control, and framework", async () => {
      vi.mocked(prisma.assessment.findFirst).mockResolvedValue({
        id: "asm_1",
        userId: "user_1",
        organizationId: "org_1",
        status: "IN_PROGRESS",
        score: null,
        createdAt: new Date("2026-04-01T00:00:00.000Z"),
        updatedAt: new Date("2026-04-02T00:00:00.000Z"),
        completedAt: null,
        items: [
          {
            id: "i1",
            status: "NOT_COMPLIANT",
            owner: null,
            targetDate: null,
            comments: null,
            remarks: null,
            evidenceNotes: null,
            _count: { evidence: 0 },
            control: {
              id: "c1",
              code: "C-1",
              title: "Control",
              description: "d",
              framework: { id: "f1", code: "GDPR", name: "GDPR" },
            },
          },
        ],
      } as never);

      const req = new Request("http://localhost/api/assessments/asm_1");
      const res = (await getAssessmentById(req, { params: { id: "asm_1" } })) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.id).toBe("asm_1");
      expect(json.data.items).toHaveLength(1);
    });

    it("returns 404 when not owned by current user", async () => {
      vi.mocked(prisma.assessment.findFirst).mockResolvedValue(null);

      const req = new Request("http://localhost/api/assessments/missing");
      const res = (await getAssessmentById(req, { params: { id: "missing" } })) as Response;
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/assessments/[id]", () => {
    it("deletes the assessment when owned by current user", async () => {
      vi.mocked(prisma.assessment.findFirst).mockResolvedValue({
        id: "asm_1",
      } as never);
      vi.mocked(prisma.assessment.delete).mockResolvedValue({
        id: "asm_1",
      } as never);

      const req = new Request("http://localhost/api/assessments/asm_1", {
        method: "DELETE",
      });
      const res = (await deleteAssessment(req, { params: { id: "asm_1" } })) as Response;
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("asm_1");
      expect(prisma.assessment.delete).toHaveBeenCalledWith({
        where: { id: "asm_1" },
      });
    });

    it("returns 404 when assessment not owned", async () => {
      vi.mocked(prisma.assessment.findFirst).mockResolvedValue(null);

      const req = new Request("http://localhost/api/assessments/missing", {
        method: "DELETE",
      });
      const res = (await deleteAssessment(req, { params: { id: "missing" } })) as Response;
      expect(res.status).toBe(404);
      expect(prisma.assessment.delete).not.toHaveBeenCalled();
    });

    it("returns 401 when not authenticated", async () => {
      vi.mocked(authHelpers.requireAuth).mockRejectedValue(new Error("401: Unauthorized"));

      const req = new Request("http://localhost/api/assessments/asm_1", {
        method: "DELETE",
      });
      const res = (await deleteAssessment(req, { params: { id: "asm_1" } })) as Response;
      expect(res.status).toBe(401);
    });
  });
});
