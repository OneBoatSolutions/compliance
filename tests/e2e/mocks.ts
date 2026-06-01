import { Page } from "@playwright/test";

export async function setupMocks(page: Page) {
  // Mock AI Compliance Mapping
  await page.route("**/api/ai/map-compliance", async (route) => {
    if (route.request().method() === "POST") {
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
              explanation: "Suggested due to operations in EU and handling of PII data.",
              tags: ["privacy", "eu", "pii"],
              frameworkId: "gdpr-fw-id",
              controls: 50,
            },
            {
              code: "HIPAA",
              name: "Health Insurance Portability and Accountability Act",
              confidence: 85,
              explanation: "Suggested due to handling of protected health information (PHI).",
              tags: ["healthcare", "us", "phi"],
              frameworkId: "hipaa-fw-id",
              controls: 40,
            },
          ],
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Mock AI Remediation
  await page.route("**/api/ai/remediation", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            steps: [
              {
                title: "Mock Step 1: Encrypt Database",
                description: "Implement AES-256 encryption at rest on all PostgreSQL instances.",
                priority: "HIGH",
                owner: "IT Security",
                estimatedHours: 12,
              },
              {
                title: "Mock Step 2: Establish DPO Role",
                description:
                  "Appoint a certified Data Protection Officer to oversee compliance processes.",
                priority: "MEDIUM",
                owner: "Compliance",
                estimatedHours: 8,
              },
              {
                title: "Mock Step 3: Train Employees",
                description: "Conduct mandatory security awareness training for all staff.",
                priority: "LOW",
                owner: "HR",
                estimatedHours: 4,
              },
            ],
            policies: ["Access Control Policy", "Data Protection Policy"],
            technicalControls: ["MFA Enforcement", "Database Encryption"],
          },
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Mock Evidence Upload
  await page.route("**/api/evidence/upload", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            evidence: [
              {
                id: "evidence-mock-id",
                assessmentItemId: "mock-item-id",
                filename: "mock-uploaded-file.pdf",
                originalName: "mock-uploaded-file.pdf",
                fileUrl: "https://s3.example.com/evidence/mock-uploaded-file.pdf",
                fileSize: 102400,
                mimeType: "application/pdf",
                description: "Mock uploaded evidence description",
                uploadedAt: new Date().toISOString(),
              },
            ],
          },
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Mock S3 requests globally to prevent navigation failures to fake S3 domains
  await page.context().route("https://s3.example.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>Mock PDF Content</body></html>",
    });
  });
}
