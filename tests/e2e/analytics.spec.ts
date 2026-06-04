import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

test.describe("Analytics Page", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept standard mocks
    await setupMocks(page);

    // Intercept /api/analytics with mock data
    await page.route("**/api/analytics*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          trend: [
            { date: "2026-05-01", score: 80 },
            { date: "2026-05-15", score: 85 },
            { date: "2026-05-30", score: 90 },
          ],
          frameworkComparison: [
            {
              frameworkId: "gdpr-fw",
              frameworkCode: "GDPR",
              frameworkName: "General Data Protection Regulation",
              score: 90,
            },
            {
              frameworkId: "hipaa-fw",
              frameworkCode: "HIPAA",
              frameworkName: "Health Insurance Portability and Accountability Act",
              score: 80,
            },
          ],
          statusDistribution: [
            { status: "COMPLIANT", count: 20 },
            { status: "PARTIALLY_COMPLIANT", count: 10 },
            { status: "NOT_COMPLIANT", count: 5 },
            { status: "NOT_APPLICABLE", count: 2 },
            { status: "NOT_STARTED", count: 13 },
          ],
          categoryCompletion: [
            {
              category: "Data Protection & Security",
              compliant: 15,
              partial: 5,
              nonCompliant: 2,
              notApplicable: 1,
            },
          ],
          riskHeatmap: [
            { severity: "CRITICAL", status: "NOT_COMPLIANT", count: 2 },
            { severity: "HIGH", status: "PARTIALLY_COMPLIANT", count: 3 },
          ],
          remediationProgress: {
            totalSteps: 10,
            completedSteps: 4,
            activePlans: 2,
            completionRate: 40,
          },
        }),
      });
    });
  });

  test("should load the analytics dashboard, render gauge, charts, and display mock data", async ({
    userPage: page,
  }) => {
    await page.goto("/analytics");

    // Verify page title and header
    await expect(page.locator("h1")).toHaveText("Compliance Analytics");

    // Verify Overall Compliance Score Gauge Card renders correctly (Average of 90 and 80 = 85%)
    await expect(page.locator("text=Overall Compliance Score")).toBeVisible();
    await expect(page.locator("text=85%").first()).toBeVisible();

    // Verify Controls Status Distribution Card (Pie Chart & list of values)
    await expect(page.locator("text=Controls Status")).toBeVisible();
    await expect(page.locator("text=Total").first()).toBeVisible();
    await expect(page.locator("text=50").first()).toBeVisible(); // totalControls: 20 + 10 + 5 + 2 + 13 = 50
    await expect(page.locator("text=COMPLIANT:").first()).toBeVisible();
    await expect(page.locator("text=20").first()).toBeVisible();

    // Verify Risk Summary Card (active gaps)
    await expect(page.locator("text=Risk Summary")).toBeVisible();
    await expect(page.locator("text=Active gaps identified")).toBeVisible();
    await expect(page.locator("text=CRITICAL").first()).toBeVisible();
    await expect(page.locator("text=HIGH").first()).toBeVisible();

    // Verify framework comparison charts and lists exist
    await expect(page.locator("text=Framework Performance")).toBeVisible();
    await expect(page.locator("text=General Data Protection Regulation").first()).toBeVisible();
    await expect(
      page.locator("text=Health Insurance Portability and Accountability Act").first(),
    ).toBeVisible();

    // Verify Recharts SVGs render (indicating chart elements exist)
    const svgs = page.locator("svg");
    const count = await svgs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should allow exporting dashboard and show export option options", async ({
    userPage: page,
  }) => {
    await page.goto("/analytics");

    // Verify export button exists
    const exportBtn = page.locator('button:has-text("Export Dashboard")');
    await expect(exportBtn).toBeVisible();

    // Click export button and check options
    await exportBtn.click();
    await expect(page.locator('text="Export as CSV"')).toBeVisible();
    await expect(page.locator('text="Export as PDF"')).toBeVisible();
  });
});
