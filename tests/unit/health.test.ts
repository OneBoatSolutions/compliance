import { describe, it, expect } from "vitest";
import { GET as healthGet } from "@/app/api/health/route";

describe("Health route", () => {
  it("returns ok payload", async () => {
    const res = (await healthGet()) as Response;
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
  });
});
