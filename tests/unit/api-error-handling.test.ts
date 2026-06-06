import { describe, it, expect } from "vitest";
import { NextResponse } from "next/server";

import { withErrorHandler } from "@/lib/api-handler";
import { ApiError } from "@/lib/app-error";
import { serviceErrorResponse } from "@/lib/service-error";

describe("withErrorHandler", () => {
  it("returns 401 for errors starting with '401'", async () => {
    const handler = withErrorHandler(async () => {
      throw new Error("401: Unauthorized");
    });

    const res = await handler(new Request("http://localhost/test"));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 403 for errors starting with '403'", async () => {
    const handler = withErrorHandler(async () => {
      throw new Error("403: Forbidden");
    });

    const res = await handler(new Request("http://localhost/test"));
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Forbidden");
  });

  it("returns 500 for generic errors", async () => {
    const handler = withErrorHandler(async () => {
      throw new Error("Something went wrong");
    });

    const res = await handler(new Request("http://localhost/test"));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Something went wrong");
  });

  it("returns 500 for non-Error thrown values", async () => {
    const handler = withErrorHandler(async () => {
      throw "just a string";
    });

    const res = await handler(new Request("http://localhost/test"));
    expect(res.status).toBe(500);
  });

  it("passes context to handler", async () => {
    const handler = withErrorHandler<{ params: { id: string } }>(async (req, ctx) => {
      return NextResponse.json({ id: ctx.params.id });
    });

    const res = await handler(new Request("http://localhost/test"), {
      params: { id: "123" },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("123");
  });
});

describe("serviceErrorResponse", () => {
  it("returns response for ApiError with custom status", async () => {
    const error = new ApiError("Not found", 404);
    const res = serviceErrorResponse(error);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Not found");
  });

  it("re-throws non-ApiError errors", () => {
    expect(() => serviceErrorResponse(new Error("generic"))).toThrow("generic");
  });
});
