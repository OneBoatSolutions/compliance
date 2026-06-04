/* eslint-disable no-console */
import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";
import { prisma } from "../../lib/prisma";

test.describe("Control Detail Workspace", () => {
  let assessmentId: string;

  test.beforeEach(async ({ page, userPage }) => {
    page.on("pageerror", (err) => {
      console.error("PAGE ERROR:", err);
    });
    page.on("console", (msg) => {
      console.log(`PAGE CONSOLE [${msg.type()}]:`, msg.text());
    });

    // Reset database state for control GDPR-P2.0 to ensure test isolation
    await prisma.assessmentItem.updateMany({
      where: {
        control: {
          code: "GDPR-P2.0",
        },
      },
      data: {
        status: "NOT_COMPLIANT",
        comments: "Encryption at rest not yet implemented",
      },
    });

    // Intercept AI/evidence requests to ensure they are stubbed
    await setupMocks(page);

    if (!assessmentId) {
      // Get assessment ID from the dashboard
      await userPage.goto("/dashboard");
      const activeAssessmentLink = userPage.locator('a[href^="/assessments/"]').first();
      await expect(activeAssessmentLink).toBeVisible();

      const href = await activeAssessmentLink.getAttribute("href");
      if (!href) {
        throw new Error("Could not find assessment link on dashboard");
      }
      assessmentId = href.split("/")[2];
    }
  });

  test("should load control workspace details correctly", async ({ userPage }) => {
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);

    // Verify header title and code
    const headerTitle = userPage.locator("h1");
    await expect(headerTitle).toContainText("Is Sensitive Data Encrypted", { timeout: 20000 });

    const breadcrumb = userPage.locator("p", { hasText: "Assessment" }).first();
    await expect(breadcrumb).toContainText("GDPR-P2.0");

    // Verify LeftPanel details
    await expect(
      userPage.getByText("Is Sensitive Data Encrypted", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      userPage.getByText("Is sensitive data (IDs, Bank Nos) encrypted?", { exact: true }),
    ).toBeVisible();
    await expect(userPage.getByText("HIGH SEVERITY", { exact: true })).toBeVisible();
  });

  test("should update compliance status selections and toggle checkmarks", async ({ userPage }) => {
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);

    const compliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Compliant$/ }) })
      .first();
    const partiallyCompliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Partially Compliant$/ }) })
      .first();
    const nonCompliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Not Compliant$/ }) })
      .first();
    const notApplicableCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Not Applicable$/ }) })
      .first();

    // The seeded status of GDPR-P2.0 is NOT_COMPLIANT
    await expect(nonCompliantCard.getByText("✔")).toBeVisible();

    // Click Partially Compliant and verify checkmark moves
    await partiallyCompliantCard.click();
    await expect(partiallyCompliantCard.getByText("✔")).toBeVisible();
    await expect(nonCompliantCard.getByText("✔")).not.toBeVisible();

    // Click Compliant and verify checkmark moves
    await compliantCard.click();
    await expect(compliantCard.getByText("✔")).toBeVisible();

    // Click Not Applicable and verify checkmark moves
    await notApplicableCard.click();
    await expect(notApplicableCard.getByText("✔")).toBeVisible();
  });

  test("should enforce comment input character limits and display counter", async ({
    userPage,
  }) => {
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);

    const commentTextarea = userPage.getByPlaceholder("Describe any compliance gaps...");
    await expect(commentTextarea).toBeVisible();

    // Check existing comment is populated from database seed
    const initialComment = await commentTextarea.inputValue();
    expect(initialComment).toContain("Encryption at rest not yet implemented");

    // Verify counter matches the initial comment length
    const initialCounter = userPage.locator("p", { hasText: "/1000" });
    await expect(initialCounter).toContainText(`${initialComment.length}/1000`);

    // Type a short comment
    await commentTextarea.fill("Testing workspace");
    await expect(initialCounter).toContainText("17/1000");

    // Enforce character limit: Try to type > 1000 characters
    const longComment = "A".repeat(1100);
    await commentTextarea.fill(longComment);

    // The value should be truncated/capped to 1000 characters due to maxLength={1000}
    const enteredValue = await commentTextarea.inputValue();
    expect(enteredValue.length).toBe(1000);
    await expect(userPage.locator("p", { hasText: "1000/1000" })).toBeVisible();
  });

  test("should successfully save draft comments and status updates", async ({ userPage }) => {
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);

    const commentTextarea = userPage.getByPlaceholder("Describe any compliance gaps...");
    const compliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Compliant$/ }) })
      .first();
    const saveDraftBtn = userPage.getByRole("button", { name: "Save Draft" });

    const uniqueComment = `E2E Test Comment ${Date.now()}`;
    await commentTextarea.fill(uniqueComment);
    await compliantCard.click();

    // Save changes
    await saveDraftBtn.click();
    await expect(userPage.getByText("Draft saved")).toBeVisible({ timeout: 20000 });

    // Reload the page and verify changes persist
    await userPage.reload();
    await expect(userPage.getByPlaceholder("Describe any compliance gaps...")).toHaveValue(
      uniqueComment,
    );
    await expect(compliantCard.getByText("✔")).toBeVisible();
  });

  test("should cancel unsaved changes when navigating away", async ({ userPage }) => {
    // Make sure we have a saved state first (Compliant + unique comment)
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);

    const commentTextarea = userPage.getByPlaceholder("Describe any compliance gaps...");
    const compliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Compliant$/ }) })
      .first();
    const partiallyCompliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Partially Compliant$/ }) })
      .first();
    const saveDraftBtn = userPage.getByRole("button", { name: "Save Draft" });

    const uniqueComment = `E2E Test Comment ${Date.now()}`;
    await commentTextarea.fill(uniqueComment);
    await compliantCard.click();
    await saveDraftBtn.click();
    await expect(userPage.getByText("Draft saved")).toBeVisible({ timeout: 20000 });

    // Now modify comments and status, but do NOT save
    await commentTextarea.fill("This temporary change should be cancelled");
    await partiallyCompliantCard.click();

    // Navigate back to checklist page (cancels unsaved changes)
    await userPage.goto(`/assessments/${assessmentId}/checklist`);

    // Return to workspace page and verify original saved values are restored
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);
    await userPage.waitForSelector("textarea");
    await expect(userPage.getByPlaceholder("Describe any compliance gaps...")).toHaveValue(
      uniqueComment,
    );
    await expect(compliantCard.getByText("✔")).toBeVisible();
    await expect(partiallyCompliantCard.getByText("✔")).not.toBeVisible();
  });

  test("should exclude N/A marked controls from score recalculations and dynamically update overall score", async ({
    userPage,
  }) => {
    await userPage.goto(`/assessments/${assessmentId}/control-workspace/GDPR-P2.0`);
    const compliantCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Compliant$/ }) })
      .first();
    const notApplicableCard = userPage
      .locator("div.cursor-pointer")
      .filter({ has: userPage.locator("p", { hasText: /^Not Applicable$/ }) })
      .first();
    const saveDraftBtn = userPage.getByRole("button", { name: "Save Draft" });

    // 1. Save state as Compliant first to establish a score baseline
    await compliantCard.click();

    // Intercept PATCH response for saving Compliant status
    const compliantPatchPromise = userPage.waitForResponse(
      (response) =>
        response.url().includes(`/api/assessments/${assessmentId}/items/`) &&
        response.request().method() === "PATCH",
    );
    await saveDraftBtn.click();
    const compliantPatchRes = await compliantPatchPromise;
    const compliantPatchJson = await compliantPatchRes.json();
    const initialScore = compliantPatchJson.data.score;

    // 2. Mark as Not Applicable (N/A) and save
    await notApplicableCard.click();

    // Intercept PATCH response for saving N/A status
    const naPatchPromise = userPage.waitForResponse(
      (response) =>
        response.url().includes(`/api/assessments/${assessmentId}/items/`) &&
        response.request().method() === "PATCH",
    );
    await saveDraftBtn.click();
    const naPatchRes = await naPatchPromise;
    const naPatchJson = await naPatchRes.json();
    const newScore = naPatchJson.data.score;

    // Verify the score has changed from initialScore
    expect(newScore).not.toEqual(initialScore);

    // Dynamic database score validation to prevent coupling to specific seed data weights
    const items = await prisma.assessmentItem.findMany({
      where: { assessmentId },
      select: {
        status: true,
        control: {
          select: {
            weight: true,
            isGateway: true,
          },
        },
      },
    });

    let numerator = 0;
    let denominator = 0;
    for (const item of items) {
      if (item.control.isGateway) {
        continue;
      }

      const status = item.status;
      let factor: number | null = 0;
      if (status === "COMPLIANT") {
        factor = 1;
      } else if (status === "PARTIALLY_COMPLIANT") {
        factor = 0.5;
      } else if (status === "NOT_APPLICABLE") {
        factor = null;
      }

      if (factor === null) {
        continue;
      }
      denominator += item.control.weight;
      numerator += item.control.weight * factor;
    }
    const expectedScore = denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;

    // Verify exact expected score value returned from API matches DB calculation
    expect(newScore).toEqual(expectedScore);
  });
});
