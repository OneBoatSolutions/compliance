import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

test.describe("Authentication & Authorization", () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    page.on("console", (msg) => {
      const text = msg.text();
      if (
        msg.type() === "error" &&
        (text.includes("EvalError") ||
          text.includes("SecurityError") ||
          text.includes("Content Security Policy") ||
          text.includes("violates the following Content Security Policy directive") ||
          text.includes("violates the Content Security Policy directive"))
      ) {
        throw new Error(`Browser console error/CSP violation detected: ${text}`);
      }
    });
  });

  test("should validate registration fields and handle successful registration", async ({
    page,
  }) => {
    await page.goto("/register");

    // Submit form empty to trigger Zod validation messages
    await page.click('button[type="submit"]');

    // Trigger password mismatch validation
    await page.fill('input[name="name"]', "John E2E");
    await page.fill('input[name="companyName"]', "E2E Testing Corp");
    const uniqueEmail = `e2e-user-${Date.now()}@example.com`;
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="confirmPassword"]', "Password123"); // Mismatch
    await page.click('button[type="submit"]');
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    // Trigger Terms & Conditions validation
    await page.fill('input[name="confirmPassword"]', "Password123!"); // Match password
    await page.click('button[type="submit"]');
    await expect(page.getByText("You must accept Terms & Privacy Policy")).toBeVisible();

    // Trigger password complexity / length validation
    await page.fill('input[name="password"]', "123");
    await page.fill('input[name="confirmPassword"]', "123");
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();

    // Enter correct fields and submit successfully
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="confirmPassword"]', "Password123!");
    // Click terms checkbox (Radix Checkbox is role="checkbox")
    await page.getByRole("checkbox").click();
    await page.click('button[type="submit"]');

    // Assert redirection and success toast
    await page.waitForURL("**/login");
    await expect(page.getByText("Account created successfully")).toBeVisible();
  });

  test("should handle login validation and invalid credentials", async ({ page }) => {
    await page.goto("/login");

    // Invalid email input validation
    await page.fill('input[name="email"]', "invalidemail");
    await page.fill('input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Invalid email")).toBeVisible();

    // Invalid credentials toast notification
    await page.fill('input[name="email"]', "invalid-user@example.com");
    await page.fill('input[name="password"]', "WrongPassword123!");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("should log in successfully and redirect based on role", async ({
    page,
    regularUser,
    adminUser,
  }) => {
    // 1. Log in as regular user -> redirect to /dashboard
    await page.goto("/login");
    await page.fill('input[name="email"]', regularUser.email);
    await page.fill('input[name="password"]', regularUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
    await expect(page.url()).toContain("/dashboard");

    // Logout
    await page.getByRole("button", { name: "Logout" }).first().click();
    await page.waitForURL("**/login");

    // 2. Log in as admin user -> redirect to /frameworks
    await page.fill('input[name="email"]', adminUser.email);
    await page.fill('input[name="password"]', adminUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/frameworks");
    await expect(page.url()).toContain("/frameworks");
  });

  test("should persist session on page reload", async ({ page, regularUser }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', regularUser.email);
    await page.fill('input[name="password"]', regularUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    // Reload the page
    await page.reload();
    await page.waitForURL("**/dashboard");
    await expect(page.url()).toContain("/dashboard");
  });

  test("should log out successfully and prevent accessing protected pages", async ({
    page,
    regularUser,
  }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', regularUser.email);
    await page.fill('input[name="password"]', regularUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    // Click logout
    await page.getByRole("button", { name: "Logout" }).first().click();
    await page.waitForURL("**/login");

    // Attempt to access dashboard directly -> should redirect to /login
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    await expect(page.url()).toContain("/login");
  });

  test("should enforce Role-Based Access Control and redirect users accordingly", async ({
    page,
    regularUser,
  }) => {
    // 1. Unauthenticated user redirects
    await page.goto("/dashboard");
    await page.waitForURL("**/login");

    await page.goto("/frameworks");
    await page.waitForURL("**/login");

    await page.goto("/admin");
    await page.waitForURL("**/login");

    // 2. Regular user (USER role) restricted from /admin and /frameworks -> redirected back to /dashboard
    await page.goto("/login");
    await page.fill('input[name="email"]', regularUser.email);
    await page.fill('input[name="password"]', regularUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");

    // Navigate to /frameworks
    await page.goto("/frameworks");
    await page.waitForURL("**/dashboard");
    await expect(page.url()).toContain("/dashboard");

    // Navigate to /admin
    await page.goto("/admin");
    await page.waitForURL("**/dashboard");
    await expect(page.url()).toContain("/dashboard");
  });

  test.skip("should rate limit and lock out user after 5 failed login attempts", async ({
    page,
  }) => {
    const email = `lockout-user-${Date.now()}@test.com`;

    // Perform 5 failed login attempts via UI
    await page.goto("/login");
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', "WrongPassword123!");
      await page.click('button[type="submit"]');
      await expect(page.getByText("Invalid email or password").first()).toBeVisible();
    }

    // The 6th attempt should trigger rate limiting lockout
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "WrongPassword123!");
    await page.click('button[type="submit"]');
    await expect(
      page.getByText("Too many failed login attempts. Please try again later."),
    ).toBeVisible();
  });
});
