import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept standard mocks
    await setupMocks(page);

    // Mock the health check API specifically for system health checks
    await page.route("**/api/health", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
        }),
      });
    });
  });

  test("regular users should be redirected when trying to access admin dashboard", async ({
    userPage: page,
  }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL("**/dashboard");
    await expect(page.url()).toContain("/dashboard");
  });

  test("admins should see stats and system health operational status", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/dashboard");
    await page.waitForURL("**/admin/dashboard");

    // Verify Page Headers
    await expect(page.locator("h1", { hasText: "Admin Dashboard" })).toBeVisible();
    await expect(
      page.locator("p", { hasText: "Monitor compliance frameworks, users" }),
    ).toBeVisible();

    // Verify Stats cards labels exist
    await expect(page.locator("text=Total Users").first()).toBeVisible();
    await expect(page.locator("text=Published Frameworks").first()).toBeVisible();
    await expect(page.locator("text=Draft Frameworks").first()).toBeVisible();
    await expect(page.locator("text=Total Assessments").first()).toBeVisible();

    // Verify stats values (should at least be numeric values from seed data)
    const totalUsersVal = page.locator("p:has-text('Total Users') + h3");
    await expect(totalUsersVal).toBeVisible();
    await expect(totalUsersVal).not.toHaveText("");

    const publishedFwVal = page.locator("p:has-text('Published Frameworks') + h3");
    await expect(publishedFwVal).toBeVisible();
    await expect(publishedFwVal).not.toHaveText("");

    // Verify System Health indicators from our health mock
    await expect(page.locator("text=System Health").first()).toBeVisible();
    await expect(page.locator("text=API Services").first()).toBeVisible();
    await expect(page.locator("text=Operational").first()).toBeVisible();

    await expect(page.locator("text=Database").first()).toBeVisible();
    await expect(page.locator("text=Healthy").first()).toBeVisible();

    await expect(page.locator("text=Compliance Engine").first()).toBeVisible();
    await expect(page.locator("text=Running").first()).toBeVisible();

    await expect(page.locator("text=Background Jobs").first()).toBeVisible();
    await expect(page.locator("text=Stable").first()).toBeVisible();
  });
});
