import { beforeEach, describe, expect, it, vi } from "vitest";

import * as authHelpers from "@/lib/auth-helpers";
import { parseMultipartRequest } from "@/lib/multipart";
import { prisma } from "@/lib/prisma";
import { DELETE, GET } from "@/app/api/evidence/[id]/route";
import { POST as uploadPost } from "@/app/api/evidence/upload/route";
import {
  deleteFileFromStorage,
  generateSignedDownloadUrl,
  uploadFileToStorage,
} from "@/services/storage-service";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      assessmentItem: {
        findFirst: vi.fn(),
      },
      evidence: {
        count: vi.fn(),
        create: vi.fn(),
        findFirst: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

vi.mock("@/lib/multipart", () => {
  return {
    parseMultipartRequest: vi.fn(),
  };
});

vi.mock("@/services/storage-service", () => {
  return {
    uploadFileToStorage: vi.fn(),
    generateSignedDownloadUrl: vi.fn(),
    deleteFileFromStorage: vi.fn(),
  };
});

describe("Evidence API routes", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
  });

  it("uploads evidence files and stores metadata", async () => {
    vi.mocked(parseMultipartRequest).mockResolvedValue({
      files: [
        {
          originalname: "policy.pdf",
          mimetype: "application/pdf",
          size: 1024,
          buffer: Buffer.from("%PDF-1.5\n%sample"),
        },
      ],
      fields: {
        assessmentItemId: "cm9x2s8n30001abcde1234567",
        description: "test evidence",
      },
    });
    vi.spyOn(prisma.assessmentItem, "findFirst").mockResolvedValue({ id: "item_1" } as never);
    vi.spyOn(prisma.evidence, "count").mockResolvedValue(0 as never);
    vi.mocked(uploadFileToStorage).mockResolvedValue({
      key: "evidence/abc.pdf",
      url: "https://example.com/evidence/abc.pdf",
    });
    vi.spyOn(prisma.evidence, "create").mockResolvedValue({
      id: "ev_1",
      assessmentItemId: "cm9x2s8n30001abcde1234567",
      filename: "evidence/abc.pdf",
      originalName: "policy.pdf",
      fileUrl: "https://example.com/evidence/abc.pdf",
      fileSize: 1024,
      mimeType: "application/pdf",
      description: "test evidence",
      uploadedAt: new Date("2026-04-23T00:00:00.000Z"),
    } as never);

    const req = new Request("http://localhost/api/evidence/upload", { method: "POST" });
    const res = (await uploadPost(req)) as Response;
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.evidence).toHaveLength(1);
  });

  it("rejects upload when files exceed per-item limit", async () => {
    vi.mocked(parseMultipartRequest).mockResolvedValue({
      files: [
        {
          originalname: "policy.pdf",
          mimetype: "application/pdf",
          size: 1024,
          buffer: Buffer.from("%PDF-1.5\n%sample"),
        },
      ],
      fields: { assessmentItemId: "cm9x2s8n30001abcde1234567" },
    });
    vi.spyOn(prisma.assessmentItem, "findFirst").mockResolvedValue({ id: "item_1" } as never);
    vi.spyOn(prisma.evidence, "count").mockResolvedValue(20 as never);

    const req = new Request("http://localhost/api/evidence/upload", { method: "POST" });
    const res = (await uploadPost(req)) as Response;

    expect(res.status).toBe(400);
  });

  it("returns signed URL for owned evidence", async () => {
    vi.spyOn(prisma.evidence, "findFirst").mockResolvedValue({
      id: "ev_1",
      filename: "evidence/abc.pdf",
      originalName: "policy.pdf",
      fileSize: 1024,
      mimeType: "application/pdf",
      description: null,
      uploadedAt: new Date("2026-04-23T00:00:00.000Z"),
    } as never);
    vi.mocked(generateSignedDownloadUrl).mockResolvedValue("https://signed.example.com/download");

    const req = new Request("http://localhost/api/evidence/ev_1", { method: "GET" });
    const res = (await GET(req, { params: Promise.resolve({ id: "ev_1" }) })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.downloadUrl).toContain("signed.example.com");
  });

  it("deletes evidence from storage and database", async () => {
    vi.spyOn(prisma.evidence, "findFirst").mockResolvedValue({
      id: "ev_1",
      filename: "evidence/abc.pdf",
    } as never);
    vi.spyOn(prisma.evidence, "delete").mockResolvedValue({ id: "ev_1" } as never);
    vi.mocked(deleteFileFromStorage).mockResolvedValue();

    const req = new Request("http://localhost/api/evidence/ev_1", { method: "DELETE" });
    const res = (await DELETE(req, { params: Promise.resolve({ id: "ev_1" }) })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(deleteFileFromStorage).toHaveBeenCalledWith("evidence/abc.pdf");
    expect(prisma.evidence.delete).toHaveBeenCalledWith({ where: { id: "ev_1" } });
  });
});
