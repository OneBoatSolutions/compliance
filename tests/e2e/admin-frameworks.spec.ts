/* eslint-disable no-console */
import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (err) => {
    console.error("PAGE ERROR:", err);
  });
  page.on("console", (msg) => {
    console.log(`PAGE CONSOLE [${msg.type()}]:`, msg.text());
  });
  await setupMocks(page);
});

test.describe("RBAC protection", () => {
  test("regular users must not access admin/framework pages and should be redirected to dashboard", async ({
    userPage,
  }) => {
    // Go to frameworks list
    await userPage.goto("/frameworks");
    await userPage.waitForURL("**/dashboard");

    // Go to create framework
    await userPage.goto("/frameworks/new");
    await userPage.waitForURL("**/dashboard");

    // Go to framework workspace with dummy ID
    await userPage.goto("/frameworks/some-random-id");
    await userPage.waitForURL("**/dashboard");
  });
});

test.describe("Framework Management Lifecycle", () => {
  test("Admin frameworks CRUD, CSV import, and publish/archive lifecycle", async ({
    adminPage,
  }) => {
    test.slow();
    // 1. Creation and Validation Errors
    // Click Create Framework button on toolbar
    await adminPage.click('text="+ Create Framework"');
    await adminPage.waitForURL("**/frameworks/new");

    // Try submitting empty form to verify validation errors
    const createButton = adminPage.getByRole("button", { name: "Create Framework", exact: true });
    await createButton.click();

    // Verify validation errors are present
    await expect(adminPage.locator('text="Framework code is required"')).toBeVisible();
    await expect(adminPage.locator('text="Framework name is required"')).toBeVisible();
    await expect(adminPage.locator('text="Description is required"')).toBeVisible();
    await expect(adminPage.locator('text="Region is required"')).toBeVisible();
    await expect(adminPage.locator('text="Category is required"')).toBeVisible();
    await expect(adminPage.locator('text="Effective date is required"')).toBeVisible();

    // Fill in valid details
    const uniqueCode = `E2E_${Date.now()}`;
    await adminPage.fill('input[name="code"]', uniqueCode);
    await adminPage.fill('input[name="name"]', "E2E Test Framework");
    await adminPage.fill(
      'textarea[name="description"]',
      "E2E framework description for compliance testing.",
    );
    await adminPage.selectOption('select[name="region"]', "US");
    await adminPage.selectOption('select[name="category"]', "Privacy");
    await adminPage.fill('input[name="version"]', "1.0.0");
    await adminPage.fill('input[name="effectiveDate"]', "2026-06-01");
    await adminPage.fill('input[name="sourceLink"]', "https://example.com");

    await createButton.click();

    // Should redirect to details page
    await adminPage.waitForURL(/\/frameworks\/[a-zA-Z0-9_-]+/);
    await expect(adminPage.locator('text="Framework Workspace"')).toBeVisible({ timeout: 20000 });
    await expect(adminPage.locator('text="Framework created"')).toBeVisible();

    // Check status is DRAFT by default
    const statusBadge = adminPage.locator('span:has-text("DRAFT")').first();
    await expect(statusBadge).toBeVisible();

    // 2. Edit Framework Metadata
    await adminPage.fill(
      'form textarea[name="description"]',
      "E2E framework description for compliance testing - UPDATED.",
    );
    await adminPage.selectOption('form select[name="category"]', "Security");
    await adminPage.click('button:has-text("Save Changes")');
    await expect(adminPage.locator('text="Framework updated"')).toBeVisible();

    // 3. Try to Publish Empty Framework (Should Fail)
    await adminPage.click('button:has-text("Publish Framework")');
    await expect(adminPage.locator('text="Failed to publish framework"').first()).toBeVisible();

    // 4. Add Control Manually
    await adminPage.fill('input[placeholder="Control Code"]', "CTRL-01");
    await adminPage.fill('input[placeholder="Title"]', "Manual Control Title");
    await adminPage.fill(
      'textarea[placeholder="Description"]',
      "Manual Control Description detail.",
    );
    await adminPage.click('button:has-text("Add Control")');

    // Verify Control is added to the table
    const controlRow01 = adminPage.locator('tr:has(input[value="CTRL-01"])');
    await expect(controlRow01).toBeVisible();
    await expect(controlRow01.locator('input[value="Manual Control Title"]')).toBeVisible();

    // Edit Control
    await controlRow01.locator('button:has-text("Edit")').click();
    await controlRow01
      .locator('input[value="Manual Control Title"]')
      .fill("Manual Control Title Updated");
    await controlRow01.locator("select").selectOption("HIGH");
    await controlRow01.locator('input[type="number"]').fill("3");
    await controlRow01.locator('button:has-text("Save")').click();

    // Verify changes are saved
    await expect(controlRow01.locator('input[value="Manual Control Title Updated"]')).toBeVisible();
    await expect(controlRow01.locator("select")).toHaveValue("HIGH");
    await expect(controlRow01.locator('input[type="number"]')).toHaveValue("3");

    // Delete Control
    await controlRow01.locator('button:has-text("Delete")').click();
    await controlRow01.locator('button:has-text("Confirm")').click();
    await expect(adminPage.locator('tr:has(input[value="CTRL-01"])')).not.toBeVisible();

    // 5. CSV Control Import
    const csvContent =
      "code,title,description,category,severity,weight\n" +
      "CSV-01,CSV Control 1,CSV Description 1,Privacy,HIGH,1.5\n" +
      "CSV-02,CSV Control 2,CSV Description 2,Security,MEDIUM,2.0";

    await adminPage.setInputFiles('input[type="file"]', {
      name: "controls.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(csvContent),
    });

    // Check preview
    await expect(adminPage.locator('text="controls.csv"')).toBeVisible();
    await expect(adminPage.locator('text="2 valid row(s) ready"')).toBeVisible();
    await expect(adminPage.locator('text="CSV-01"')).toBeVisible();
    await expect(adminPage.locator('text="CSV-02"')).toBeVisible();

    // Click Confirm Import
    await adminPage.click('button:has-text("Confirm Import")');
    await expect(adminPage.locator('text="Imported 2 controls"')).toBeVisible();

    // Verify both controls appear in the table
    const csvRow01 = adminPage.locator('tr:has(input[value="CSV-01"])');
    await expect(csvRow01).toBeVisible();
    await expect(csvRow01.locator('input[value="CSV Control 1"]')).toBeVisible();

    const csvRow02 = adminPage.locator('tr:has(input[value="CSV-02"])');
    await expect(csvRow02).toBeVisible();
    await expect(csvRow02.locator('input[value="CSV Control 2"]')).toBeVisible();

    // 6. Publish Lifecycle (DRAFT -> PUBLISHED)
    await adminPage.click('button:has-text("Publish Framework")');

    // Wait for the status badge to update to PUBLISHED
    const publishedBadge = adminPage.getByText("PUBLISHED").first();
    await expect(publishedBadge).toBeVisible();

    // Verify form elements and controls are locked/disabled
    await expect(adminPage.locator('form textarea[name="description"]')).toBeDisabled();
    await expect(adminPage.locator('form select[name="category"]')).toBeDisabled();
    await expect(adminPage.locator('button:has-text("Save Changes")')).not.toBeVisible();

    await expect(adminPage.locator('input[placeholder="Control Code"]')).toBeDisabled();
    await expect(adminPage.locator('input[placeholder="Title"]')).toBeDisabled();
    await expect(adminPage.locator('textarea[placeholder="Description"]')).toBeDisabled();
    await expect(adminPage.locator('button:has-text("Add Control")')).toBeDisabled();

    await expect(adminPage.locator('input[type="file"]')).toBeDisabled();

    await expect(csvRow01.locator('input[value="CSV-01"]')).toBeDisabled();
    await expect(csvRow01.locator('input[value="CSV Control 1"]')).toBeDisabled();
    await expect(csvRow01.locator('button:has-text("Edit")')).toBeDisabled();
    await expect(csvRow01.locator('button:has-text("Delete")')).toBeDisabled();

    // 7. Archive Lifecycle (PUBLISHED -> ARCHIVED)
    const archiveButton = adminPage.locator('button:has-text("Archive Framework")');
    await expect(archiveButton).toBeVisible();
    await archiveButton.click();

    // Wait for status badge to update to ARCHIVED
    const archivedBadge = adminPage.getByText("ARCHIVED").first();
    await expect(archivedBadge).toBeVisible();
    await expect(archiveButton).not.toBeVisible();
  });
});
