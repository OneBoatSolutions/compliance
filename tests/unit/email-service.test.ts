import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

// Store original env (using type assertion to bypass readonly)
const originalEnv = { ...process.env } as typeof process.env;

describe("email-service", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv } as typeof process.env;
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("does nothing in test environment (NODE_ENV=test)", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    const { sendPasswordResetEmail } = await import("@/services/email-service");
    await expect(
      sendPasswordResetEmail({
        to: "test@test.com",
        name: "Test",
        resetLink: "http://localhost/reset",
      }),
    ).resolves.toBeUndefined();
  });

  it("logs to console in development without crashing", async () => {
    const { sendPasswordResetEmail } = await import("@/services/email-service");
    await expect(
      sendPasswordResetEmail({
        to: "test@test.com",
        name: "Test",
        resetLink: "http://localhost/reset",
      }),
    ).resolves.toBeUndefined();
  });

  it("attempts to send email when API key is configured", async () => {
    (process.env as Record<string, string | undefined>).RESEND_API_KEY = "re_test_key";
    (process.env as Record<string, string | undefined>).EMAIL_FROM = "noreply@cipherion.com";

    const { Resend } = await import("resend");
    const mockSend = vi.fn().mockResolvedValue({ id: "email_1" });
    vi.mocked(Resend).mockImplementation(() => ({
      emails: { send: mockSend },
    }));

    const { sendPasswordResetEmail } = await import("@/services/email-service");
    await sendPasswordResetEmail({
      to: "user@example.com",
      name: "User",
      resetLink: "http://localhost/reset?token=abc",
    });

    expect(Resend).toHaveBeenCalledWith("re_test_key");
  });

  it("handles missing name gracefully", async () => {
    const { sendPasswordResetEmail } = await import("@/services/email-service");
    await expect(
      sendPasswordResetEmail({ to: "test@test.com", resetLink: "http://localhost/reset" }),
    ).resolves.toBeUndefined();
  });
});
