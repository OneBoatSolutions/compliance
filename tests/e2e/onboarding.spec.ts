import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

interface OrgPatchPayload {
  productName?: string;
  description?: string;
  services?: string;
  targetCustomers?: string;
  problemSolved?: string;
  dataHandled?: string[];
  regions?: string[];
  [key: string]: unknown;
}

interface AssessmentPostPayload {
  organizationId: string;
  frameworkIds: string[];
  [key: string]: unknown;
}

test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept evidence and AI requests
    await setupMocks(page);
  });

  test("should complete the onboarding flow successfully with AI recommendation review and assessment creation", async ({
    page,
    loggedInPage,
  }) => {
    // Mock the organizations list to return an empty profile
    await page.route("**/api/organizations", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "org-123",
                name: "Test Org",
                productName: null,
                description: null,
                services: null,
                targetCustomers: null,
                problemSolved: null,
                dataHandled: null,
                regions: null,
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock individual organization GET
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-123",
              name: "Test Org",
              productName: null,
              description: null,
              services: null,
              targetCustomers: null,
              problemSolved: null,
              dataHandled: null,
              regions: null,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock organization updates (PATCH)
    let updatedPayload: OrgPatchPayload | null = null;
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "PATCH") {
        updatedPayload = route.request().postDataJSON() as OrgPatchPayload;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-123",
              name: "Test Org",
              ...(updatedPayload || {}),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock assessments creation
    let assessmentPayload: AssessmentPostPayload | null = null;
    await page.route("**/api/assessments", async (route) => {
      if (route.request().method() === "POST") {
        assessmentPayload = route.request().postDataJSON() as AssessmentPostPayload;
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              assessmentId: "assessment-456",
              totalItems: 12,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock frameworks published search (for manual add)
    await page.route("**/api/frameworks/published*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: "soc2-fw-id",
              code: "SOC2",
              name: "SOC 2 Type II",
              description: "Security and Privacy criteria",
              region: "Global",
              category: "Security",
              version: "2017",
              _count: { controls: 85 },
            },
          ],
        }),
      });
    });

    // Log in
    const userPage = await loggedInPage("user");

    // Go to onboarding
    await userPage.goto("/onboarding");
    await userPage.waitForResponse("**/api/organizations/org-123");

    // Verify initial validation state (Submit button is disabled since fields are empty)
    const nextBtn = userPage.getByRole("button", { name: /Next: AI Recommendations/i });
    await expect(nextBtn).toBeDisabled();

    // Fill in product details
    await userPage.locator('input[name="productName"]').fill("HealthTracker");
    await userPage
      .locator('textarea[name="description"]')
      .fill("A fitness and nutrition tracking app");
    await userPage.locator('textarea[name="services"]').fill("Mobile and web application");
    await userPage.locator('textarea[name="customers"]').fill("Individual fitness consumers");
    await userPage
      .locator('textarea[name="problem"]')
      .fill("Hard to count calories and track workouts");

    // Click data types: PII and PHI
    await userPage.getByText("PII", { exact: true }).click();
    await userPage.getByText("PHI", { exact: true }).click();

    // Click regions: US and EU
    await userPage.getByText("US", { exact: true }).click();
    await userPage.getByText("EU", { exact: true }).click();

    // Verify submit button is now enabled
    await expect(nextBtn).toBeEnabled();

    // Click submit and check AI loading states
    await nextBtn.click();

    // Wait for suggested frameworks redirect
    await userPage.waitForURL("**/onboarding/suggested-frameworks");

    // Verify suggestions loaded (GDPR preselected, HIPAA not preselected)
    const gdprCard = userPage
      .locator("div", { hasText: "General Data Protection Regulation" })
      .first();
    const hipaaCard = userPage
      .locator("div", { hasText: "Health Insurance Portability and Accountability Act" })
      .first();

    await expect(gdprCard.getByRole("button", { name: "Selected" }).first()).toBeVisible();
    await expect(hipaaCard.getByRole("button", { name: "+ Select" }).first()).toBeVisible();

    // Select HIPAA (toggle it on)
    await hipaaCard.getByRole("button", { name: "+ Select" }).first().click();
    await expect(hipaaCard.getByRole("button", { name: "Selected" }).first()).toBeVisible();

    // Unselect GDPR (toggle it off)
    await gdprCard.getByRole("button", { name: "Selected" }).first().click();
    await expect(gdprCard.getByRole("button", { name: "+ Select" }).first()).toBeVisible();

    // Manual add framework flow
    await userPage.getByRole("button", { name: "Add Framework" }).click();
    // Modal should be open
    await expect(userPage.getByRole("heading", { name: "Add Framework" })).toBeVisible();

    // Search for a framework
    const searchInput = userPage.getByPlaceholder("Search by name or code...");
    await searchInput.fill("SOC2");

    // Click on the result
    await userPage.locator("button", { hasText: "SOC 2 Type II" }).click();

    // Modal should close and SOC 2 should be added/selected
    await expect(userPage.getByText("SOC 2 Type II").first()).toBeVisible();
    const soc2Card = userPage.locator("div", { hasText: "SOC 2 Type II" }).first();
    await expect(soc2Card.getByRole("button", { name: "Selected" }).first()).toBeVisible();

    // Create the assessment
    const createBtn = userPage.getByRole("button", { name: "Continue to Assessment →" });
    await createBtn.click();

    // Verify redirected to checklist page
    await userPage.waitForURL("**/assessments/assessment-456/checklist");

    // Verify payload sent to /api/assessments was correct
    expect(assessmentPayload).toEqual({
      organizationId: "org-123",
      frameworkIds: ["hipaa-fw-id", "soc2-fw-id"], // GDPR was unselected
    });
  });

  test("should show form validations on submission with empty fields", async ({
    page,
    loggedInPage,
  }) => {
    // Mock the organizations list to return an empty profile
    await page.route("**/api/organizations", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "org-123",
                name: "Test Org",
                productName: null,
                description: null,
                services: null,
                targetCustomers: null,
                problemSolved: null,
                dataHandled: null,
                regions: null,
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock individual organization GET
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-123",
              name: "Test Org",
              productName: null,
              description: null,
              services: null,
              targetCustomers: null,
              problemSolved: null,
              dataHandled: null,
              regions: null,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Log in
    const userPage = await loggedInPage("user");
    await userPage.goto("/onboarding");
    await userPage.waitForResponse("**/api/organizations/org-123");

    // Fill in product details to make step 1 valid, but leave checkbox sections empty
    await userPage.locator('input[name="productName"]').fill("Validation Tester");
    await userPage.locator('textarea[name="description"]').fill("Test Description");
    await userPage.locator('textarea[name="services"]').fill("Test Services");
    await userPage.locator('textarea[name="customers"]').fill("Test Customers");
    await userPage.locator('textarea[name="problem"]').fill("Test Problem");

    // The Next button should be enabled now because isStep1Valid is true
    const nextBtn = userPage.getByRole("button", { name: /Next: AI Recommendations/i });
    await expect(nextBtn).toBeEnabled();

    // Click Next, which will trigger form onSubmit validation and fail
    await nextBtn.click();

    // Verify validation errors appear for missing data types and regions
    await expect(userPage.getByText("Select at least one").first()).toBeVisible();
    await expect(userPage.getByText("Select at least one").last()).toBeVisible();
  });

  test("should resume draft and support auto-saving changes", async ({ page, loggedInPage }) => {
    // Mock the organizations list to return an existing profile draft
    await page.route("**/api/organizations", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "org-123",
                name: "Test Org",
                productName: "Draft Tracker",
                description: "A fitness draft",
                services: "App only",
                targetCustomers: "Beta testers",
                problemSolved: "Hard to track things",
                dataHandled: ["PII (Personally Identifiable Information)", "Employee data"],
                regions: ["United States", "Canada"],
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock individual organization GET
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-123",
              name: "Test Org",
              productName: "Draft Tracker",
              description: "A fitness draft",
              services: "App only",
              targetCustomers: "Beta testers",
              problemSolved: "Hard to track things",
              dataHandled: ["PII (Personally Identifiable Information)", "Employee data"],
              regions: ["United States", "Canada"],
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Setup patch tracking
    let patchCount = 0;
    let patchPayload: OrgPatchPayload | null = null;
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "PATCH") {
        patchCount++;
        patchPayload = route.request().postDataJSON() as OrgPatchPayload;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-123",
              name: "Test Org",
              ...(patchPayload || {}),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Log in
    const userPage = await loggedInPage("user");
    await userPage.goto("/onboarding");
    await userPage.waitForResponse("**/api/organizations/org-123");

    // Verify fields are pre-populated
    await expect(userPage.locator('input[name="productName"]')).toHaveValue("Draft Tracker");
    await expect(userPage.locator('textarea[name="description"]')).toHaveValue("A fitness draft");
    await expect(userPage.locator('textarea[name="services"]')).toHaveValue("App only");
    await expect(userPage.locator('textarea[name="customers"]')).toHaveValue("Beta testers");
    await expect(userPage.locator('textarea[name="problem"]')).toHaveValue("Hard to track things");

    // Verify pre-selected checkbox cards
    const piiCard = userPage
      .locator("div.border")
      .filter({ has: userPage.locator("p", { hasText: /^PII$/ }) })
      .first();
    const employeeCard = userPage
      .locator("div.border")
      .filter({ has: userPage.locator("p", { hasText: /^Employee Data$/ }) })
      .first();
    const usCard = userPage
      .locator("div.border")
      .filter({ has: userPage.locator("span", { hasText: /^US$/ }) })
      .first();
    const canadaCard = userPage
      .locator("div.border")
      .filter({ has: userPage.locator("span", { hasText: /^Canada$/ }) })
      .first();

    await expect(piiCard).toHaveClass(/bg-purple-50/);
    await expect(employeeCard).toHaveClass(/bg-purple-50/);

    // Check class for region selection (bg-purple-50)
    await expect(usCard).toHaveClass(/bg-purple-50/);
    await expect(canadaCard).toHaveClass(/bg-purple-50/);

    // Test auto-saving: Modify a text field and wait for the patch request
    await userPage.locator('input[name="productName"]').fill("Draft Tracker Updated");

    // Verify auto-save triggers after 2 seconds
    // Wait for the PATCH request to /api/organizations/org-123
    const responsePromise = userPage.waitForResponse(
      (response) =>
        response.url().includes("/api/organizations/org-123") &&
        response.request().method() === "PATCH",
    );
    await responsePromise;

    // Verify all changes saved message in stepper
    await expect(userPage.getByText("✔ All changes saved")).toBeVisible();
    expect(patchCount).toBeGreaterThan(0);
    expect(patchPayload.productName).toBe("Draft Tracker Updated");
  });

  test("should handle AI mapping API failure and support retry", async ({ page, loggedInPage }) => {
    // Mock the organizations list to return an empty profile
    await page.route("**/api/organizations", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: "org-123",
                name: "Test Org",
                productName: null,
                description: null,
                services: null,
                targetCustomers: null,
                problemSolved: null,
                dataHandled: null,
                regions: null,
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock individual organization GET
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "org-123",
              name: "Test Org",
              productName: null,
              description: null,
              services: null,
              targetCustomers: null,
              problemSolved: null,
              dataHandled: null,
              regions: null,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock organization updates (PATCH)
    await page.route("**/api/organizations/org-123", async (route) => {
      if (route.request().method() === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: { id: "org-123" },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock AI failure first, then success
    let aiCallCount = 0;
    await page.route("**/api/ai/map-compliance", async (route) => {
      aiCallCount++;
      if (aiCallCount <= 2) {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            error: "Internal server error mapping compliance.",
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: [
              {
                code: "GDPR",
                name: "General Data Protection Regulation",
                confidence: 95,
                explanation: "Suggested due to operations in EU.",
                tags: ["privacy", "eu"],
                frameworkId: "gdpr-fw-id",
                controls: 50,
              },
            ],
          }),
        });
      }
    });

    // Log in
    const userPage = await loggedInPage("user");
    await userPage.goto("/onboarding");
    await userPage.waitForResponse("**/api/organizations/org-123");

    // Fill form
    await userPage.locator('input[name="productName"]').fill("Error Test");
    await userPage.locator('textarea[name="description"]').fill("Test Description");
    await userPage.locator('textarea[name="services"]').fill("Test Services");
    await userPage.locator('textarea[name="customers"]').fill("Test Customers");
    await userPage.locator('textarea[name="problem"]').fill("Test Problem");
    await userPage.getByText("PII", { exact: true }).click();
    await userPage.getByText("US", { exact: true }).click();

    // Click Next (submits and triggers AI mapping which fails first)
    await userPage.getByRole("button", { name: /Next: AI Recommendations/i }).click();

    // Check error banner and retry button
    const errorBanner = userPage.getByText("Internal server error mapping compliance.");
    await expect(errorBanner).toBeVisible();
    const retryBtn = userPage.getByRole("button", { name: "Retry" });
    await expect(retryBtn).toBeVisible();

    // Click Retry (should succeed)
    await retryBtn.click();

    // Redirected successfully
    await userPage.waitForURL("**/onboarding/suggested-frameworks");
    await expect(userPage.getByText("General Data Protection Regulation").first()).toBeVisible();
  });
});
