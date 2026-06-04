/* eslint-disable no-console */
import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

test.describe("Reports Feature Category", () => {
  const mockAssessmentId = "mock-assessment-id";

  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (err) => {
      console.error("PAGE ERROR:", err);
    });
    page.on("console", (msg) => {
      console.log(`PAGE CONSOLE [${msg.type()}]:`, msg.text());
    });

    // Intercept standard AI & upload requests
    await setupMocks(page);

    // Mock API call to get assessments
    await page.route("**/api/assessments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: mockAssessmentId,
            status: "IN_PROGRESS",
            score: 85.5,
            createdAt: new Date().toISOString(),
            organizationId: "mock-org-id",
          },
        ]),
      });
    });

    // Mock reports view API
    await page.route(new RegExp(`/api/reports/${mockAssessmentId}/view`), async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          reportTitle: "Compliance Readiness Report",
          generatedAt: new Date().toISOString(),
          overallScore: 85,
          completionPercent: 90,
          readinessBand: "Compliant",
          executiveSummary:
            "This is a mock executive summary explaining that the organization is compliant.",
          findings: [
            { type: "success", text: "5 controls fully implemented and operational" },
            { type: "warning", text: "1 critical controls require immediate attention" },
          ],
          alerts: [
            {
              title: "Critical Controls Require Attention",
              description: "1 critical control(s) identified.",
            },
          ],
          criticalRisksCount: 1,
          criticalRisks: [
            {
              code: "GDPR-P2.0",
              title: "Database Encryption",
              severity: "CRITICAL",
              status: "NOT_COMPLIANT",
            },
          ],
          topRecommendations: [{ title: "Implement Database Encryption" }],
          frameworkScores: [
            {
              frameworkCode: "GDPR",
              frameworkName: "General Data Protection Regulation",
              score: 85,
            },
          ],
          riskSummary: {
            totalRiskScore: 12,
            openHighRisks: 1,
            openMediumRisks: 2,
            openLowRisks: 1,
            riskLevel: "Medium",
          },
          distribution: {
            critical: 1,
            high: 2,
            medium: 2,
            low: 5,
          },
          heatmap: [{ severity: "CRITICAL", status: "NOT_COMPLIANT", count: 1 }],
          remediation: [
            {
              id: "GDPR-P2.0",
              action: "Implement Database Encryption",
              owner: "John Doe",
              dueDate: "2026-06-30",
              progress: 50,
            },
          ],
          controlRows: [
            {
              code: "GDPR-P2.0",
              title: "Database Encryption",
              frameworkCode: "GDPR",
              frameworkName: "General Data Protection Regulation",
              severity: "CRITICAL",
              status: "NOT_COMPLIANT",
              evidenceCount: 0,
              riskScore: 3,
              owner: "John Doe",
              targetDate: "2026-06-30",
              uiStatus: "IN_PROGRESS",
              priority: "HIGH",
              progress: 50,
            },
          ],
          evidenceRows: [
            {
              code: "GDPR-P2.0",
              title: "Database Encryption",
              count: 0,
              examples: "No evidence uploaded yet",
              risk: "High",
            },
          ],
          organization: {
            id: "mock-org-id",
            name: "HealthTrack",
            productName: "HealthTrack App",
            description: "Mock description",
            services: "Mock services",
            targetCustomers: "Mock customers",
            problemSolved: "Mock problem",
            dataHandled: ["PII"],
            regions: ["US"],
          },
          assessment: {
            id: mockAssessmentId,
            status: "IN_PROGRESS",
            score: 85,
            createdAt: new Date().toISOString(),
            completedAt: null,
          },
        }),
      });
    });

    // Mock reports history API (initial state: one report)
    await page.route(new RegExp(`/api/reports/${mockAssessmentId}/history`), async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "mock-report-history-1",
            type: "COMPLIANCE_READINESS",
            format: "PDF",
            generatedAt: "2026-05-30T12:00:00.000Z",
            url: "https://s3.example.com/reports/mock-report-history-1.pdf",
          },
        ]),
      });
    });

    // Mock report generate API
    await page.route(new RegExp(`/api/reports/${mockAssessmentId}/generate`), async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          fileUrl: "https://s3.example.com/reports/mock-report-new.pdf",
        }),
      });
    });

    // Mock report download API
    await page.route(new RegExp(`/api/reports/${mockAssessmentId}/download`), async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://s3.example.com/reports/mock-report-download.pdf",
        }),
      });
    });
  });

  test("should redirect from /reports to latest assessment reports page", async ({ userPage }) => {
    await userPage.goto("/reports");
    await userPage.waitForURL(new RegExp(`/assessments/${mockAssessmentId}/reports`));
    await expect(userPage).toHaveURL(new RegExp(`/assessments/${mockAssessmentId}/reports`));
  });

  test("should render the compliance readiness report layout and detailed sections", async ({
    userPage,
  }) => {
    await userPage.goto(`/assessments/${mockAssessmentId}/reports`);

    // Verify App/Product Name from Cover
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "COMPLIANCE READINESS" })
        .getByText("HealthTrack App", { exact: true }),
    ).toBeVisible();

    // Verify Readiness Score and Band
    await expect(
      userPage.locator("section").filter({ hasText: "EXECUTIVE SUMMARY" }).getByText("85%"),
    ).toBeVisible();
    await expect(
      userPage.locator("section").filter({ hasText: "EXECUTIVE SUMMARY" }).getByText("COMPLIANT"),
    ).toBeVisible();

    // Verify Key Findings
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "EXECUTIVE SUMMARY" })
        .getByText("5 controls fully implemented and operational"),
    ).toBeVisible();
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "EXECUTIVE SUMMARY" })
        .getByText("1 critical controls require immediate attention"),
    ).toBeVisible();

    // Verify Organization Profile
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "ORGANIZATION COMPLIANCE PROFILE" })
        .getByText("HealthTrack App", { exact: true }),
    ).toBeVisible();
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "ORGANIZATION COMPLIANCE PROFILE" })
        .getByText(mockAssessmentId),
    ).toBeVisible();

    // Verify Risk Analysis & Visualizations
    await expect(userPage.locator("section").filter({ hasText: "RISK ANALYSIS" })).toBeVisible();
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "RISK ANALYSIS" })
        .getByText("Inherent Risk Heatmap"),
    ).toBeVisible();

    // Verify Roadmap section
    await expect(
      userPage.locator("section").filter({ hasText: "REMEDIATION ROADMAP" }),
    ).toBeVisible();
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "REMEDIATION ROADMAP" })
        .getByText("TOTAL ACTIONS"),
    ).toBeVisible();

    // Verify Report History is rendered with mock item
    const historySection = userPage.locator("section").filter({ hasText: "REPORT HISTORY" });
    await expect(historySection.getByRole("row")).toHaveCount(2); // Header row + 1 mock row
    await expect(historySection.getByText("COMPLIANCE_READINESS")).toBeVisible();
    await expect(historySection.getByText("PDF")).toBeVisible();
  });

  test("should support copying the share report link to clipboard", async ({ userPage }) => {
    await userPage.addInitScript(() => {
      let clipboardText = "";
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: async (text: string) => {
            clipboardText = text;
          },
          readText: async () => {
            return clipboardText;
          },
        },
        configurable: true,
      });
    });

    await userPage.goto(`/assessments/${mockAssessmentId}/reports`);

    // Click share button
    const shareButton = userPage.getByRole("button", { name: "Share" });
    await shareButton.dispatchEvent("click");

    // Verify success toast
    await expect(userPage.getByText("Link copied!")).toBeVisible();

    // Verify clipboard content matches window URL
    const clipboardText = await userPage.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain(`/assessments/${mockAssessmentId}/reports`);
  });

  test("should trigger print function when print button is clicked", async ({ userPage }) => {
    await userPage.addInitScript(() => {
      (window as unknown as Record<string, boolean>).printCalled = false;
      window.print = () => {
        (window as unknown as Record<string, boolean>).printCalled = true;
      };
    });

    await userPage.goto(`/assessments/${mockAssessmentId}/reports`);

    // Click Print button (first one)
    const printButton = userPage.getByRole("button", { name: "Print" }).first();
    await printButton.dispatchEvent("click");

    // Verify print was triggered
    const printCalled = await userPage.evaluate(
      () => (window as unknown as Record<string, boolean>).printCalled,
    );
    expect(printCalled).toBe(true);
  });

  test("should generate compliance readiness report and open new tab", async ({ userPage }) => {
    let apiCalled = false;
    await userPage.route(new RegExp(`/api/reports/${mockAssessmentId}/generate`), async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          fileUrl: "https://s3.example.com/reports/mock-report-new.pdf",
        }),
      });
    });

    await userPage.goto(`/assessments/${mockAssessmentId}/reports`);

    // Click generate button
    const generateButton = userPage.getByRole("button", { name: "Generate Report" });
    await expect(generateButton).toBeEnabled();
    await generateButton.dispatchEvent("click");

    // Verify loading state and success toast
    await expect(userPage.getByText("Report generated successfully")).toBeVisible();
    expect(apiCalled).toBe(true);
  });

  test("should download PDF report and trigger download API", async ({ userPage }) => {
    let apiCalled = false;
    await userPage.route(new RegExp(`/api/reports/${mockAssessmentId}/download`), async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://s3.example.com/reports/mock-report-download.pdf",
        }),
      });
    });

    await userPage.goto(`/assessments/${mockAssessmentId}/reports`);

    // Click download button
    const downloadButton = userPage.getByRole("button", { name: "Download" }).first();
    await expect(downloadButton).toBeEnabled();
    await downloadButton.dispatchEvent("click");

    // Verify toast notification
    await expect(userPage.getByText("Download started")).toBeVisible();
    expect(apiCalled).toBe(true);
  });

  test("should show error and support retry when view API fails", async ({ userPage }) => {
    let shouldFail = true;

    await userPage.route(new RegExp(`/api/reports/${mockAssessmentId}/view`), async (route) => {
      if (shouldFail) {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            reportTitle: "Compliance Readiness Report",
            generatedAt: new Date().toISOString(),
            overallScore: 85,
            completionPercent: 90,
            readinessBand: "Compliant",
            executiveSummary: "This is a mock executive summary.",
            findings: [],
            alerts: [],
            criticalRisksCount: 0,
            criticalRisks: [],
            topRecommendations: [],
            frameworkScores: [],
            riskSummary: {
              totalRiskScore: 0,
              openHighRisks: 0,
              openMediumRisks: 0,
              openLowRisks: 0,
              riskLevel: "Low",
            },
            distribution: { critical: 0, high: 0, medium: 0, low: 0 },
            heatmap: [],
            remediation: [],
            controlRows: [],
            evidenceRows: [],
            organization: {
              name: "HealthTrack",
              productName: "HealthTrack App",
              services: "",
              dataHandled: [],
              regions: [],
            },
            assessment: {
              id: mockAssessmentId,
              status: "IN_PROGRESS",
              score: 85,
              createdAt: new Date().toISOString(),
              completedAt: null,
            },
          }),
        });
      }
    });

    await userPage.goto(`/assessments/${mockAssessmentId}/reports`);

    // Verify error state
    await expect(userPage.getByText("Failed to load report data.")).toBeVisible();
    const retryButton = userPage.getByRole("button", { name: "Retry" });
    await expect(retryButton).toBeVisible();

    // Set to succeed on next call and retry
    shouldFail = false;
    await retryButton.dispatchEvent("click");

    // Verify page loads report successfully (error state gone)
    await expect(userPage.getByText("Failed to load report data.")).toBeHidden();
    await expect(
      userPage
        .locator("section")
        .filter({ hasText: "COMPLIANCE READINESS" })
        .getByText("HealthTrack App", { exact: true }),
    ).toBeVisible();
  });
});
