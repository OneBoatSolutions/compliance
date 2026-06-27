import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import * as authHelpers from "@/lib/auth-helpers";
import { GET as organizationsGet, POST as organizationsPost } from "@/app/api/organizations/route";
import {
  GET as organizationGet,
  PATCH as organizationPatch,
} from "@/app/api/organizations/[id]/route";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      organization: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    },
  };
});

describe("Organizations API routes", () => {
  const session = { user: { id: "user_1", role: "USER" } };

  const validCreatePayload = {
    name: "Acme",
    productName: "Acme Secure",
    description: "Compliance management platform",
    services: "Security monitoring",
    targetCustomers: "SMBs",
    problemSolved: "Automates control evidence collection",
    dataHandled: ["PII (Personally Identifiable Information)"],
    regions: ["United States"],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authHelpers, "requireAuth").mockResolvedValue(session as never);
  });

  it("creates an organization with valid payload", async () => {
    vi.spyOn(prisma.organization, "create").mockResolvedValue({
      id: "org_1",
      ...validCreatePayload,
      userId: session.user.id,
    } as never);

    const req = new Request("http://localhost/api/organizations", {
      method: "POST",
      body: JSON.stringify(validCreatePayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await organizationsPost(req)) as Response;
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.userId).toBe(session.user.id);
  });

  it("lists organizations for the authenticated user", async () => {
    vi.spyOn(prisma.organization, "findMany").mockResolvedValue([
      {
        id: "org_1",
        ...validCreatePayload,
        userId: session.user.id,
      },
    ] as never);

    const res = (await organizationsGet(
      new Request("http://localhost/api/organizations"),
    )) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data[0].id).toBe("org_1");
  });

  it("rejects create when required fields are missing", async () => {
    const req = new Request("http://localhost/api/organizations", {
      method: "POST",
      body: JSON.stringify({
        productName: "Acme Secure",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await organizationsPost(req)) as Response;
    expect(res.status).toBe(422);
  });

  it("gets an organization for the owner", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: session.user.id,
      ...validCreatePayload,
    } as never);

    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "GET",
    });

    const res = (await organizationGet(req, {
      params: Promise.resolve({ id: "org_1" }),
    })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe("org_1");
  });

  it("returns 403 when organization belongs to another user", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: "another_user",
      ...validCreatePayload,
    } as never);

    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "GET",
    });

    const res = (await organizationGet(req, {
      params: Promise.resolve({ id: "org_1" }),
    })) as Response;
    expect(res.status).toBe(403);
  });

  it("returns 404 for GET when organization does not exist", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/organizations/missing", {
      method: "GET",
    });

    const res = (await organizationGet(req, {
      params: Promise.resolve({ id: "missing" }),
    })) as Response;
    expect(res.status).toBe(404);
  });

  it("supports auto-save via PATCH with partial payload", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: session.user.id,
      ...validCreatePayload,
    } as never);

    vi.spyOn(prisma.organization, "update").mockResolvedValue({
      id: "org_1",
      userId: session.user.id,
      ...validCreatePayload,
      description: "Updated description",
    } as never);

    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "PATCH",
      body: JSON.stringify({
        description: "Updated description",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await organizationPatch(req, {
      params: Promise.resolve({ id: "org_1" }),
    })) as Response;
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.description).toBe("Updated description");
  });

  it("returns 404 for PATCH when organization does not exist", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue(null as never);

    const req = new Request("http://localhost/api/organizations/missing", {
      method: "PATCH",
      body: JSON.stringify({
        description: "Updated description",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await organizationPatch(req, {
      params: Promise.resolve({ id: "missing" }),
    })) as Response;
    expect(res.status).toBe(404);
  });

  it("rejects PATCH payload with invalid field length", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: session.user.id,
      ...validCreatePayload,
    } as never);

    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "PATCH",
      body: JSON.stringify({
        productName: "x".repeat(101),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await organizationPatch(req, {
      params: Promise.resolve({ id: "org_1" }),
    })) as Response;
    expect(res.status).toBe(422);
  });

  it("rejects PATCH with empty payload", async () => {
    vi.spyOn(prisma.organization, "findUnique").mockResolvedValue({
      id: "org_1",
      userId: session.user.id,
      ...validCreatePayload,
    } as never);

    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "PATCH",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = (await organizationPatch(req, {
      params: Promise.resolve({ id: "org_1" }),
    })) as Response;
    expect(res.status).toBe(422);
  });

  it("maps requireAuth unauthorized errors to 401", async () => {
    vi.spyOn(authHelpers, "requireAuth").mockRejectedValue(new Error("401: Unauthorized"));

    const req = new Request("http://localhost/api/organizations/org_1", {
      method: "GET",
    });

    const res = (await organizationGet(req, {
      params: Promise.resolve({ id: "org_1" }),
    })) as Response;
    expect(res.status).toBe(401);
  });
});
