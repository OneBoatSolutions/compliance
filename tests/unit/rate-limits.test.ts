import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { recordFailedAttempt, isLocked, resetAttempts } from "@/lib/rate-limits";

describe("rate-limits", () => {
  beforeEach(() => {
    // Reset by attempting a known identifier
    resetAttempts("user:ip");
  });

  afterEach(() => {
    resetAttempts("user:ip");
  });

  it("is not locked when no attempts have been recorded", () => {
    expect(isLocked("user:ip")).toBe(false);
  });

  it("is not locked when attempts are below the maxAttempts threshold", () => {
    recordFailedAttempt("user:ip");
    recordFailedAttempt("user:ip");
    recordFailedAttempt("user:ip");
    recordFailedAttempt("user:ip");

    expect(isLocked("user:ip")).toBe(false);
  });

  it("locks the identifier after 5 failed attempts", () => {
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt("user:ip");
    }
    expect(isLocked("user:ip")).toBe(true);
  });

  it("clears the lock window after the lock time has elapsed", () => {
    for (let i = 0; i < 5; i++) {
      recordFailedAttempt("user:ip");
    }
    expect(isLocked("user:ip")).toBe(true);

    // Advance the clock past 15 minutes
    const now = Date.now();
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(now + 16 * 60 * 1000);

    expect(isLocked("user:ip")).toBe(false);

    dateSpy.mockRestore();
  });

  it("resetAttempts removes the identifier from tracking", () => {
    recordFailedAttempt("user:ip");
    expect(isLocked("user:ip")).toBe(false);

    resetAttempts("user:ip");
    expect(isLocked("user:ip")).toBe(false);
  });
});
