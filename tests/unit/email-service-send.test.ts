import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "email_1" }),
    },
  })),
}));

// Store original env (using type assertion to bypass readonly)
const originalEnv = { ...process.env } as typeof process.env;

describe("email-service: full send path", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv } as typeof process.env;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    (process.env as Record<string, string | undefined>).RESEND_API_KEY = "re_test_key";
    (process.env as Record<string, string | undefined>).EMAIL_FROM = "noreply@example.com";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("sends an email via Resend when API key and from are configured", async () => {
    const { Resend } = await import("resend");
    const { sendPasswordResetEmail } = await import("@/services/email-service");

    await sendPasswordResetEmail({
      to: "user@example.com",
      name: "User",
      resetLink: "http://localhost/reset?token=abc",
    });

    expect(Resend).toHaveBeenCalledWith("re_test_key");
  });

  it("warns and returns when API key is missing", async () => {
    delete (process.env as Record<string, string | undefined>).RESEND_API_KEY;
    const { sendPasswordResetEmail } = await import("@/services/email-service");

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await sendPasswordResetEmail({
      to: "user@example.com",
      resetLink: "http://localhost/reset",
    });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("warns and returns when EMAIL_FROM is missing", async () => {
    delete (process.env as Record<string, string | undefined>).EMAIL_FROM;
    const { sendPasswordResetEmail } = await import("@/services/email-service");

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await sendPasswordResetEmail({
      to: "user@example.com",
      resetLink: "http://localhost/reset",
    });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("catches and logs errors from Resend API", async () => {
    const { Resend } = await import("resend");
    vi.mocked(Resend).mockImplementationOnce(
      () =>
        ({
          emails: {
            send: vi.fn().mockRejectedValue(new Error("rate limited")),
          },
        }) as never,
    );

    const { sendPasswordResetEmail } = await import("@/services/email-service");

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await sendPasswordResetEmail({
      to: "user@example.com",
      resetLink: "http://localhost/reset",
    });

    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});
