import { describe, expect, it } from "vitest";

import { maybeCompressJsonResponse } from "@/lib/compress-response";

describe("maybeCompressJsonResponse", () => {
  it("gzip-compresses large JSON when client accepts gzip", async () => {
    const payload = { success: true, data: { items: "x".repeat(2000) } };
    const original = new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    const req = new Request("http://localhost/api/dashboard", {
      headers: { "Accept-Encoding": "gzip" },
    });

    const compressed = await maybeCompressJsonResponse(req, original);

    expect(compressed.headers.get("Content-Encoding")).toBe("gzip");
  });

  it("skips compression for small JSON payloads", async () => {
    const body = JSON.stringify({ success: true, data: { ok: true } });
    const original = new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    const req = new Request("http://localhost/api/health", {
      headers: { "Accept-Encoding": "gzip" },
    });

    const result = await maybeCompressJsonResponse(req, original);

    expect(result.headers.get("Content-Encoding")).toBeNull();
    expect(await result.text()).toBe(body);
  });
});
