import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/health/route";

describe("Health API", () => {
  it("should return OK", async () => {
    const req = new NextRequest("http://localhost/api/health");
    const res = await GET(req);
    const data = await res.json();

    expect(data.status).toBe("ok");
  });
});
