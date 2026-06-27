import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

interface RemediationPlanStep {
  id: string;
  status: string;
  [key: string]: unknown;
}

interface RemediationPlan {
  id: string;
  status: string;
  steps: RemediationPlanStep[];
  [key: string]: unknown;
}

test.describe("AI Remediation Plan Flow", () => {
  let savedPlanData: RemediationPlan | null = null;

  test.beforeEach(async ({ page }) => {
    // Intercept all AI and evidence upload requests using the shared mock helper
    await setupMocks(page);

    // Reset saved plan state for each test run to ensure isolation
    savedPlanData = null;

    // Mock GET /api/remediation-plans to simulate empty or saved state
    await page.route("**/api/remediation-plans?assessmentItemId=*", async (route) => {
      if (savedPlanData) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: savedPlanData }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: null }),
        });
      }
    });

    // Mock POST /api/remediation-plans to intercept saves
    await page.route("**/api/remediation-plans", async (route) => {
      if (route.request().method() === "POST") {
        const body = JSON.parse(route.request().postData() || "{}");
        savedPlanData = {
          id: "mock-plan-id",
          ...body,
          status: "ACTIVE",
          steps: body.steps.map((step: Record<string, unknown>, index: number) => ({
            id: `step-${index + 1}`,
            ...step,
            status: (step.status as string) || "TODO",
          })),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: savedPlanData }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock PATCH /api/remediation-plans/*/steps/* to intercept step updates
    await page.route("**/api/remediation-plans/*/steps/*", async (route) => {
      if (route.request().method() === "PATCH") {
        const body = JSON.parse(route.request().postData() || "{}");
        const url = route.request().url();
        const stepId = url.split("/").pop() || "";
        if (savedPlanData) {
          savedPlanData.steps = savedPlanData.steps.map((step: RemediationPlanStep) => {
            if (step.id === stepId) {
              return { ...step, status: body.status };
            }
            return step;
          });
          const allDone = savedPlanData.steps.every(
            (s: RemediationPlanStep) => s.status === "DONE",
          );
          savedPlanData.status = allDone ? "COMPLETED" : "ACTIVE";
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: stepId,
              status: body.status,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test("should load assessment from dashboard, expand control, go to control workspace, and check visibility rules", async ({
    userPage: page,
  }) => {
    test.slow();
    // Navigate from Dashboard to Assessment Checklist
    await page.waitForSelector("text=Active Assessments");
    const assessmentLink = page.locator('a[href*="/assessments/"]').first();
    await expect(assessmentLink).toBeVisible();
    await assessmentLink.click();
    await page.waitForURL("**/assessments/*/checklist");

    // Search for the specific control GDPR-P2.0 to filter the checklist and avoid pagination issues
    const searchInput = page.locator('input[placeholder="Search controls by ID or title..."]');
    await searchInput.fill("GDPR-P2.0");

    // Expand the GDPR group in the Checklist
    const groupHeader = page.locator("text=GDPR - Data Protection & Security").first();
    await expect(groupHeader).toBeVisible({ timeout: 20000 });
    await groupHeader.click();

    // Find and expand control GDPR-P2.0
    const controlCode = page.locator("span", { hasText: "GDPR-P2.0" }).first();
    await expect(controlCode).toBeVisible();
    await controlCode.click();

    // Click 'View Full Workspace' to navigate to the workspace page
    const viewWorkspaceLink = page.locator("a", { hasText: "View Full Workspace" }).first();
    await expect(viewWorkspaceLink).toBeVisible({ timeout: 15000 });
    await viewWorkspaceLink.click();
    await page.waitForURL("**/control-workspace/**");

    // 1. Check Visibility Rules for status "Not Compliant"
    // Click "Not Compliant" status card to make sure status is set
    await page.click('text="Not Compliant"');
    const aiCardButton = page.locator("div.from-purple-600 button").first();
    await expect(aiCardButton).toHaveText("Get Remediation Plan");

    // 2. Check Visibility Rules for status "Partially Compliant"
    await page.click('text="Partially Compliant"');
    await expect(aiCardButton).toHaveText("Improve Plan");

    // 3. Check Visibility Rules for status "Compliant"
    await page.click('text="Compliant"');
    await expect(aiCardButton).toHaveText("Ask AI");
  });

  test("should trigger AI remediation generation, verify steps list, save the plan, update step status, and export as PDF", async ({
    userPage: page,
  }) => {
    test.slow();
    // Go directly to the workspace for the seeded control GDPR-P2.0
    // We need to fetch the assessment ID first.
    // Let's do it by navigating to dashboard and clicking on the checklist, then getting URL
    await page.waitForSelector("text=Active Assessments");
    const assessmentLink = page.locator('a[href*="/assessments/"]').first();
    await assessmentLink.click();
    await page.waitForURL("**/assessments/*/checklist");
    const url = page.url();
    const match = url.match(/\/assessments\/([^/]+)\/checklist/);
    if (!match) {
      throw new Error("Could not parse assessment ID from URL");
    }
    const assessmentId = match[1];

    // Go directly to control workspace
    await page.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);
    await page.waitForURL("**/control-workspace/GDPR-P2.0");

    // Ensure status is Not Compliant so we have "Get Remediation Plan"
    await page.click('text="Not Compliant"');

    // Trigger AI Remediation Plan generation
    const getPlanButton = page.locator("button", { hasText: "Get Remediation Plan" }).first();
    await expect(getPlanButton).toBeVisible({ timeout: 20000 });
    await getPlanButton.click();

    // Verify Remediation Drawer is open and loading is completed
    const drawerTitle = page.locator("h2", { hasText: "AI Remediation Plan" }).first();
    await expect(drawerTitle).toBeVisible();

    // Verify AI-generated steps are listed with priority, owner, estimated hours
    // Step 1: Encrypt Database (HIGH, IT Security, 12h)
    const step1Title = page.locator("p", { hasText: "Mock Step 1: Encrypt Database" }).first();
    await expect(step1Title).toBeVisible();
    const step1Priority = page.locator("span", { hasText: "HIGH" }).first();
    await expect(step1Priority).toBeVisible();
    const step1Owner = page.locator("span", { hasText: "Owner: IT Security" }).first();
    await expect(step1Owner).toBeVisible();
    const step1Hours = page.locator("span", { hasText: "12h" }).first();
    await expect(step1Hours).toBeVisible();

    // Step 2: Establish DPO Role (MEDIUM, Compliance, 8h)
    const step2Title = page.locator("p", { hasText: "Mock Step 2: Establish DPO Role" }).first();
    await expect(step2Title).toBeVisible();
    const step2Priority = page.locator("span", { hasText: "MEDIUM" }).first();
    await expect(step2Priority).toBeVisible();
    const step2Owner = page.locator("span", { hasText: "Owner: Compliance" }).first();
    await expect(step2Owner).toBeVisible();
    const step2Hours = page.locator("span", { hasText: "8h" }).first();
    await expect(step2Hours).toBeVisible();

    // Step 3: Train Employees (LOW, HR, 4h)
    const step3Title = page.locator("p", { hasText: "Mock Step 3: Train Employees" }).first();
    await expect(step3Title).toBeVisible();
    const step3Priority = page.locator("span", { hasText: "LOW" }).first();
    await expect(step3Priority).toBeVisible();
    const step3Owner = page.locator("span", { hasText: "Owner: HR" }).first();
    await expect(step3Owner).toBeVisible();
    const step3Hours = page.locator("span", { hasText: "4h" }).first();
    await expect(step3Hours).toBeVisible();

    // Verify Policy Recommendations are visible
    await expect(page.locator("text=Access Control Policy")).toBeVisible();
    await expect(page.locator("text=Data Protection Policy")).toBeVisible();

    // Verify Technical Controls in the sidebar are visible
    await expect(page.locator("li", { hasText: "MFA Enforcement" })).toBeVisible();
    await expect(page.locator("li", { hasText: "Database Encryption" })).toBeVisible();

    // Verify effort total in sidebar (12 + 8 + 4 = 24h)
    await expect(page.locator("text=24h")).toBeVisible();

    // Save the plan
    const saveButton = page.locator("button", { hasText: "Save Plan" }).first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verify success toast shows up
    const toastMessage = page.locator("text=Plan saved").first();
    await expect(toastMessage).toBeVisible();

    // Update step status: mark Step 1 as completed
    const completeStep1Btn = page.locator('button[aria-label="Mark step complete"]').first();
    await expect(completeStep1Btn).toBeVisible();
    await completeStep1Btn.click();

    // Verify step status updates (e.g. line-through style or icon change or completed status)
    const step1TitleDone = page
      .locator("p.line-through", { hasText: "Mock Step 1: Encrypt Database" })
      .first();
    await expect(step1TitleDone).toBeVisible();

    // Test PDF export flow (window.print mock)
    await page.evaluate(() => {
      (window as unknown as Record<string, boolean>).printCalled = false;
      window.print = () => {
        (window as unknown as Record<string, boolean>).printCalled = true;
      };
    });

    const exportPdfButton = page.locator("button", { hasText: "PDF" }).first();
    await expect(exportPdfButton).toBeVisible();
    await exportPdfButton.click();

    const isPrintCalled = await page.evaluate(
      () => (window as unknown as Record<string, boolean>).printCalled,
    );
    expect(isPrintCalled).toBe(true);

    // Test AI Remediation Plan regeneration
    const regenerateButton = page.locator("button", { hasText: "Regenerate" }).first();
    await expect(regenerateButton).toBeVisible();
    await regenerateButton.click();

    // Verify success toast for regeneration shows up
    const regenToast = page.locator("text=Plan regenerated").first();
    await expect(regenToast).toBeVisible();
  });
});
