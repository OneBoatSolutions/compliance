import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health API", () => {
  it("should return OK", async () => {
    const res = await GET();
    const data = await res.json();

    expect(data.status).toBe("ok");
  });
});
