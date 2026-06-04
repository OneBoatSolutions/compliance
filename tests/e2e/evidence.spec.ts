import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

test.describe("Evidence Upload and Management", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept standard AI mapping, AI remediation, and S3 file upload endpoints
    await setupMocks(page);

    // Mock Control Workspace Page details query for mock-assessment-id and control GDPR-P2.0
    await page.route(
      "**/api/assessments/mock-assessment-id/items?search=GDPR-P2.0&limit=100",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: [
              {
                id: "mock-item-id",
                status: "NOT_STARTED",
                comments: null,
                owner: null,
                targetDate: null,
                _count: { evidence: 0 },
                control: {
                  id: "mock-control-id",
                  code: "GDPR-P2.0",
                  title: "Encryption at Rest",
                  description:
                    "Ensure all databases store personal data in an encrypted format at rest.",
                  severity: "HIGH",
                  weight: 10,
                  framework: { code: "GDPR" },
                },
              },
            ],
          }),
        });
      },
    );

    // Mock section progress
    await page.route(
      "**/api/assessments/mock-assessment-id/section-progress?controlId=mock-control-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            total: 5,
            compliant: 1,
            partiallyCompliant: 1,
            nonCompliant: 1,
            notStarted: 2,
          }),
        });
      },
    );
  });

  test("should display the empty state initially when no evidence is uploaded", async ({
    userPage,
  }) => {
    // Mock empty evidence list
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ evidence: [] }),
        });
      },
    );

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    // Verify workspace loaded
    await expect(userPage.locator("h1", { hasText: "Encryption at Rest" })).toBeVisible();
    await expect(userPage.locator("text=Supporting Evidence")).toBeVisible();

    // Verify empty state: "Uploaded Files" heading should not exist
    await expect(userPage.locator("text=Uploaded Files")).not.toBeVisible();
  });

  test("should allow uploading files via click/file input selection", async ({ userPage }) => {
    // Mock empty evidence list initially
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ evidence: [] }),
        });
      },
    );

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    // File input selection
    const fileInput = userPage.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-evidence.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("pdf dummy content"),
    });

    // Verify upload success toast and file listing in UI
    await expect(userPage.locator("text=test-evidence.pdf uploaded successfully.")).toBeVisible();
    await expect(userPage.locator("text=Uploaded Files")).toBeVisible();
    await expect(userPage.locator("p", { hasText: "test-evidence.pdf" }).first()).toBeVisible();
    await expect(userPage.locator("text=17 Bytes")).toBeVisible();
  });

  test("should allow uploading files via drag-and-drop", async ({ userPage }) => {
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ evidence: [] }),
        });
      },
    );

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    // Drag-and-drop simulation
    const dataTransfer = await userPage.evaluateHandle(() => {
      const dt = new DataTransfer();
      const file = new File(["png content"], "screenshot.png", { type: "image/png" });
      dt.items.add(file);
      return dt;
    });

    await userPage.dispatchEvent("text=Drag & drop files here", "drop", { dataTransfer });

    // Verify toast & file details listed in UI (since mocks.ts returns mock-uploaded-file.pdf)
    await expect(userPage.locator("text=screenshot.png uploaded successfully.")).toBeVisible();
    await expect(userPage.locator("p", { hasText: "screenshot.png" }).first()).toBeVisible();
  });

  test("should validate allowed file types (PDF, PNG, JPG work, others fail)", async ({
    userPage,
  }) => {
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ evidence: [] }),
        });
      },
    );

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    const fileInput = userPage.locator('input[type="file"]');

    // Test invalid file type (e.g. .exe)
    await fileInput.setInputFiles({
      name: "malicious-script.exe",
      mimeType: "application/x-msdownload",
      buffer: Buffer.from("malicious binary content"),
    });

    // Verify error toast
    await expect(
      userPage.locator("text=File type not allowed: malicious-script.exe"),
    ).toBeVisible();
    await expect(userPage.locator("text=mock-uploaded-file.pdf")).not.toBeVisible();

    // Test valid file type (e.g. JPG)
    await fileInput.setInputFiles({
      name: "system-config.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("jpeg dummy data"),
    });

    // Verify success toast
    await expect(userPage.locator("text=system-config.jpg uploaded successfully.")).toBeVisible();
  });

  test("should validate file size limits (reject files larger than 10MB)", async ({ userPage }) => {
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ evidence: [] }),
        });
      },
    );

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    const fileInput = userPage.locator('input[type="file"]');

    // Create a buffer larger than 10MB (11MB)
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024);

    await fileInput.setInputFiles({
      name: "huge-evidence-logs.pdf",
      mimeType: "application/pdf",
      buffer: largeBuffer,
    });

    // Verify error toast
    await expect(
      userPage.locator("text=File exceeds 10MB limit: huge-evidence-logs.pdf"),
    ).toBeVisible();
    await expect(userPage.locator("text=mock-uploaded-file.pdf")).not.toBeVisible();
  });

  test("should support downloading existing files", async ({ userPage }) => {
    // Mock existing evidence listed on load
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            evidence: [
              {
                id: "evidence-mock-id",
                originalName: "policy-document.pdf",
                fileSize: 204800,
                mimeType: "application/pdf",
                description: "Corporate Information Security Policy",
                uploadedAt: new Date().toISOString(),
              },
            ],
          }),
        });
      },
    );

    // Mock GET details/download endpoint
    let downloadApiCalled = false;
    await userPage.route("**/api/evidence/evidence-mock-id", async (route) => {
      downloadApiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "evidence-mock-id",
          filename: "policy-document.pdf",
          originalName: "policy-document.pdf",
          fileSize: 204800,
          mimeType: "application/pdf",
          description: "Corporate Information Security Policy",
          uploadedAt: new Date().toISOString(),
          downloadUrl: "https://s3.example.com/evidence/policy-document.pdf?signed=true",
        }),
      });
    });

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    // Verify existing file is listed
    await expect(userPage.locator("text=policy-document.pdf")).toBeVisible();
    await expect(userPage.locator("text=200 KB")).toBeVisible();

    // Click download button and wait for popup
    const [popup] = await Promise.all([
      userPage.waitForEvent("popup"),
      userPage.locator('button[title="Download file"]').click(),
    ]);

    // Verify correct download URL was opened
    await popup.waitForURL("https://s3.example.com/evidence/policy-document.pdf?signed=true");
    expect(popup.url()).toBe("https://s3.example.com/evidence/policy-document.pdf?signed=true");
    expect(downloadApiCalled).toBe(true);
  });

  test("should support deleting existing files", async ({ userPage }) => {
    // Mock existing evidence listed on load
    await userPage.route(
      "**/api/assessments/mock-assessment-id/items/mock-item-id",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            evidence: [
              {
                id: "evidence-mock-id",
                originalName: "deletable-file.png",
                fileSize: 51200,
                mimeType: "image/png",
                description: "Temporary evidence",
                uploadedAt: new Date().toISOString(),
              },
            ],
          }),
        });
      },
    );

    // Mock DELETE endpoint
    let deleteRequestSent = false;
    await userPage.route("**/api/evidence/evidence-mock-id", async (route) => {
      if (route.request().method() === "DELETE") {
        deleteRequestSent = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "evidence-mock-id",
            deleted: true,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await userPage.goto("/assessments/mock-assessment-id/control-workspace/GDPR-P2.0");

    // Verify existing file is listed
    await expect(userPage.locator("text=deletable-file.png")).toBeVisible();

    // Click remove button
    await userPage.locator('button[title="Remove file"]').click();

    // Verify delete API called and file removed from UI
    await expect(userPage.locator("text=File deleted successfully")).toBeVisible();
    await expect(userPage.locator("text=deletable-file.png")).not.toBeVisible();
    expect(deleteRequestSent).toBe(true);
  });
});
