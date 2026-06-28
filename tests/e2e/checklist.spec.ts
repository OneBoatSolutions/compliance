import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";

interface ChecklistControlFramework {
  id: string;
  code: string;
  name: string;
}

interface ChecklistControl {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  weight: number;
  framework: ChecklistControlFramework;
}

interface ChecklistItem {
  id: string;
  status: string;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { evidence: number };
  control: ChecklistControl;
}

const mockItems = [
  {
    id: "item-1",
    status: "NOT_COMPLIANT",
    comments: "Missing database encryption at rest",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 1 },
    control: {
      id: "ctrl-1",
      code: "GDPR-P2.0",
      title: "Data Encryption",
      description: "Personal data must be encrypted at rest and in transit.",
      category: "Data Protection",
      severity: "CRITICAL",
      weight: 10,
      framework: {
        id: "gdpr-fw-id",
        code: "GDPR",
        name: "General Data Protection Regulation",
      },
    },
  },
  {
    id: "item-2",
    status: "NOT_COMPLIANT",
    comments: "No DPO assigned yet",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-2",
      code: "GDPR-M11.0",
      title: "Establish DPO",
      description: "Appoint a Data Protection Officer if processing sensitive data at scale.",
      category: "Data Protection",
      severity: "CRITICAL",
      weight: 10,
      framework: {
        id: "gdpr-fw-id",
        code: "GDPR",
        name: "General Data Protection Regulation",
      },
    },
  },
  {
    id: "item-3",
    status: "NOT_STARTED",
    comments: null,
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-3",
      code: "GDPR-M1.0",
      title: "Governance Program",
      description: "Establish a formal privacy governance program.",
      category: "General",
      severity: "LOW",
      weight: 2,
      framework: {
        id: "gdpr-fw-id",
        code: "GDPR",
        name: "General Data Protection Regulation",
      },
    },
  },
  {
    id: "item-4",
    status: "PARTIALLY_COMPLIANT",
    comments: "Access logs created, not reviewed regularly",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-4",
      code: "HIPAA-S1-Q1",
      title: "Risk Analysis",
      description: "Conduct an accurate and thorough assessment of potential security risks.",
      category: "Access Control",
      severity: "HIGH",
      weight: 8,
      framework: {
        id: "hipaa-fw-id",
        code: "HIPAA",
        name: "Health Insurance Portability and Accountability Act",
      },
    },
  },
  {
    id: "item-5",
    status: "NOT_COMPLIANT",
    comments: "No training plan",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-5",
      code: "HIPAA-S3-Q10",
      title: "Security Awareness Training",
      description: "Implement security awareness training program for all members.",
      category: "Security Training",
      severity: "CRITICAL",
      weight: 10,
      framework: {
        id: "hipaa-fw-id",
        code: "HIPAA",
        name: "Health Insurance Portability and Accountability Act",
      },
    },
  },
  {
    id: "item-6",
    status: "NOT_COMPLIANT",
    comments: "PAN stored in plain text in legacy reports",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-6",
      code: "PCI-3.5.1",
      title: "PAN Protection",
      description: "Protect stored cardholder data (CHD).",
      category: "Encryption",
      severity: "HIGH",
      weight: 8,
      framework: {
        id: "pci-fw-id",
        code: "PCI-DSS",
        name: "Payment Card Industry Data Security Standard",
      },
    },
  },
  {
    id: "item-7",
    status: "COMPLIANT",
    comments: "MFA enabled on all servers",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 2 },
    control: {
      id: "ctrl-7",
      code: "PCI-8.4.2",
      title: "MFA Enforcement",
      description: "Enforce multi-factor authentication (MFA) for administrative access.",
      category: "IAM",
      severity: "HIGH",
      weight: 8,
      framework: {
        id: "pci-fw-id",
        code: "PCI-DSS",
        name: "Payment Card Industry Data Security Standard",
      },
    },
  },
  {
    id: "item-8",
    status: "PARTIALLY_COMPLIANT",
    comments: "Data inventory partial",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 1 },
    control: {
      id: "ctrl-8",
      code: "GDPR-D3.1",
      title: "Data Inventory",
      description: "Maintain a record of processing activities.",
      category: "Data Protection",
      severity: "MEDIUM",
      weight: 5,
      framework: {
        id: "gdpr-fw-id",
        code: "GDPR",
        name: "General Data Protection Regulation",
      },
    },
  },
  {
    id: "item-9",
    status: "NOT_COMPLIANT",
    comments: "Transit encryption gaps in internal APIs",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-9",
      code: "HIPAA-S4-Q9",
      title: "Transmission Security",
      description: "Encrypt ePHI during transmission over public networks.",
      category: "Network",
      severity: "HIGH",
      weight: 8,
      framework: {
        id: "hipaa-fw-id",
        code: "HIPAA",
        name: "Health Insurance Portability and Accountability Act",
      },
    },
  },
  {
    id: "item-10",
    status: "PARTIALLY_COMPLIANT",
    comments: "Firewall rules draft complete",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-10",
      code: "PCI-1.3.1",
      title: "Firewall Configuration",
      description: "Establish cardholder data environment (CDE) boundary.",
      category: "Network",
      severity: "HIGH",
      weight: 8,
      framework: {
        id: "pci-fw-id",
        code: "PCI-DSS",
        name: "Payment Card Industry Data Security Standard",
      },
    },
  },
  {
    id: "item-11",
    status: "COMPLIANT",
    comments: "Centralized IAM",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 1 },
    control: {
      id: "ctrl-11",
      code: "PCI-2.2.2",
      title: "Default Passwords Changed",
      description: "Change vendor default credentials before deploying systems.",
      category: "IAM",
      severity: "MEDIUM",
      weight: 5,
      framework: {
        id: "pci-fw-id",
        code: "PCI-DSS",
        name: "Payment Card Industry Data Security Standard",
      },
    },
  },
  {
    id: "item-12",
    status: "NOT_COMPLIANT",
    comments: "Incident response plan untested",
    createdAt: "2026-05-30T12:00:00.000Z",
    updatedAt: "2026-05-30T12:00:00.000Z",
    _count: { evidence: 0 },
    control: {
      id: "ctrl-12",
      code: "GDPR-P4.0",
      title: "Incident Response",
      description: "Implement procedure for data breach notifications.",
      category: "General",
      severity: "HIGH",
      weight: 8,
      framework: {
        id: "gdpr-fw-id",
        code: "GDPR",
        name: "General Data Protection Regulation",
      },
    },
  },
];

function calculateOverallScore(items: ChecklistItem[]): number {
  let numerator = 0;
  let denominator = 0;
  for (const item of items) {
    const w = item.control.weight;
    if (item.status === "NOT_APPLICABLE") {
      continue;
    }
    denominator += w;
    if (item.status === "COMPLIANT") {
      numerator += w * 1.0;
    } else if (item.status === "PARTIALLY_COMPLIANT") {
      numerator += w * 0.5;
    }
  }
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

interface FrameworkScore {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  score: number;
}

function calculateFrameworkScores(items: ChecklistItem[]): FrameworkScore[] {
  const map: Record<
    string,
    {
      frameworkId: string;
      frameworkCode: string;
      frameworkName: string;
      numerator: number;
      denominator: number;
    }
  > = {};
  for (const item of items) {
    const fwId = item.control.framework.id;
    const fwCode = item.control.framework.code;
    const fwName = item.control.framework.name;
    if (!map[fwId]) {
      map[fwId] = {
        frameworkId: fwId,
        frameworkCode: fwCode,
        frameworkName: fwName,
        numerator: 0,
        denominator: 0,
      };
    }
    const w = item.control.weight;
    if (item.status === "NOT_APPLICABLE") {
      continue;
    }
    map[fwId].denominator += w;
    if (item.status === "COMPLIANT") {
      map[fwId].numerator += w * 1.0;
    } else if (item.status === "PARTIALLY_COMPLIANT") {
      map[fwId].numerator += w * 0.5;
    }
  }

  return Object.values(map).map((f) => ({
    frameworkId: f.frameworkId,
    frameworkCode: f.frameworkCode,
    frameworkName: f.frameworkName,
    score: f.denominator > 0 ? Math.round((f.numerator / f.denominator) * 100) : 0,
  }));
}

test.describe("Assessment Checklist E2E", () => {
  let items: ChecklistItem[] = JSON.parse(JSON.stringify(mockItems));

  test.beforeEach(async ({ page }) => {
    // Inject global AI & evidence upload mocks
    await setupMocks(page);

    // Reset local data state for isolation
    items = JSON.parse(JSON.stringify(mockItems));

    // Mock GET /api/assessments
    await page.route("**/api/assessments", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: "assessment-1",
              status: "IN_PROGRESS",
              score: calculateOverallScore(items),
              createdAt: "2026-05-30T12:00:00.000Z",
              organizationId: "org-1",
            },
          ],
        }),
      });
    });

    // Mock GET /api/assessments/assessment-1
    await page.route("**/api/assessments/assessment-1", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "assessment-1",
            organizationId: "org-1",
            status: "IN_PROGRESS",
            score: calculateOverallScore(items),
            createdAt: "2026-05-30T12:00:00.000Z",
            updatedAt: "2026-05-30T12:00:00.000Z",
            items: items,
          },
        }),
      });
    });

    // Mock GET /api/assessments/assessment-1/score
    await page.route("**/api/assessments/assessment-1/score", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            assessmentId: "assessment-1",
            score: calculateOverallScore(items),
            frameworkScores: calculateFrameworkScores(items),
          },
        }),
      });
    });

    // Mock GET /api/assessments/assessment-1/items (handles pagination, filter, search & sort)
    await page.route(/\/api\/assessments\/assessment-1\/items(\?.*)?$/, async (route) => {
      const url = new URL(route.request().url());
      const pageNum = parseInt(url.searchParams.get("page") || "1", 10);
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      const search = url.searchParams.get("search") || "";
      const frameworks = url.searchParams.getAll("framework");
      const statuses = url.searchParams.getAll("status");
      const severities = url.searchParams.getAll("severity");
      const sortBy = url.searchParams.get("sortBy") || "severity";
      const sortOrder = url.searchParams.get("sortOrder") || "desc";

      const filtered = items.filter((item: ChecklistItem) => {
        if (search) {
          const term = search.toLowerCase();
          const matches =
            item.control.code.toLowerCase().includes(term) ||
            item.control.title.toLowerCase().includes(term) ||
            item.control.description.toLowerCase().includes(term);
          if (!matches) {
            return false;
          }
        }
        if (frameworks.length > 0 && !frameworks.includes(item.control.framework.id)) {
          return false;
        }
        if (statuses.length > 0 && !statuses.includes(item.status)) {
          return false;
        }
        if (severities.length > 0 && !severities.includes(item.control.severity)) {
          return false;
        }
        return true;
      });

      // Sort logic
      const severityRank: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
      const statusRank: Record<string, number> = {
        NOT_STARTED: 1,
        PARTIALLY_COMPLIANT: 2,
        NOT_COMPLIANT: 3,
        COMPLIANT: 4,
        NOT_APPLICABLE: 5,
      };

      filtered.sort((a: ChecklistItem, b: ChecklistItem) => {
        let diff = 0;
        if (sortBy === "severity") {
          diff = severityRank[a.control.severity] - severityRank[b.control.severity];
        } else if (sortBy === "status") {
          diff = statusRank[a.status] - statusRank[b.status];
        } else if (sortBy === "updatedAt") {
          diff = Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
        } else if (sortBy === "code") {
          diff = a.control.code.localeCompare(b.control.code);
        }
        return sortOrder === "asc" ? diff : -diff;
      });

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const startIndex = (pageNum - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            items: paginated,
            meta: {
              total,
              page: pageNum,
              limit,
              totalPages,
              hasNextPage: pageNum < totalPages,
              hasPrevPage: pageNum > 1,
            },
          },
        }),
      });
    });

    // Mock PATCH /api/assessments/assessment-1/items/<itemId>
    await page.route(/\/api\/assessments\/assessment-1\/items\/([^?/]+)/, async (route) => {
      if (route.request().method() === "PATCH") {
        const url = route.request().url();
        const match = url.match(/\/items\/([^?/]+)/);
        const itemId = match ? match[1] : null;

        const body = JSON.parse(route.request().postData() || "{}");
        const item = items.find((i: ChecklistItem) => i.id === itemId);
        if (item) {
          if (body.status !== undefined) {
            item.status = body.status;
          }
          item.updatedAt = new Date().toISOString();
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              score: calculateOverallScore(items),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test("renders control checklist and metrics correctly", async ({ userPage }) => {
    // Navigate from index page
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    // Verify header title
    await expect(userPage.locator("h1")).toHaveText("Assessment Checklist");

    // Overall Compliance Progress Check
    await expect(userPage.locator("text=Overall Compliance")).toBeVisible();
    await expect(userPage.locator("text=92%")).toBeVisible(); // completionPercent: 92%
    await expect(userPage.locator("text=26% Compliance Rate")).toBeVisible(); // overall score: 26%

    // Verify framework groups are listed in collapsed form
    await expect(userPage.locator("text=GDPR - Data Protection")).toBeVisible({ timeout: 20000 });
    await expect(userPage.locator("text=HIPAA - Access Control")).toBeVisible();
    await expect(userPage.locator("text=PCI-DSS - IAM")).toBeVisible();
  });

  test("collapses and expands control groups", async ({ userPage }) => {
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    // Initially collapsed: controls are not visible
    await expect(userPage.locator("text=GDPR-P2.0")).not.toBeVisible();

    // Click to expand
    await userPage.click("text=GDPR - Data Protection");

    // Now control details are visible
    await expect(userPage.locator("text=GDPR-P2.0")).toBeVisible();
    await expect(userPage.locator("text=Data Encryption")).toBeVisible();

    // Click again to collapse
    await userPage.click("text=GDPR - Data Protection");

    // Hidden again
    await expect(userPage.locator("text=GDPR-P2.0")).not.toBeVisible();
  });

  test("filters controls by search input filter", async ({ userPage }) => {
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    const searchInput = userPage.locator('input[placeholder="Search controls by ID or title..."]');
    await searchInput.fill("Risk Analysis");

    // Only HIPAA - Access Control should match
    await expect(userPage.locator("text=HIPAA - Access Control")).toBeVisible();
    await expect(userPage.locator("text=GDPR - Data Protection")).not.toBeVisible();

    // Clear search using the X button
    await userPage.locator("button:has(svg.lucide-x)").click();

    // All groups should reappear
    await expect(searchInput).toHaveValue("");
    await expect(userPage.locator("text=GDPR - Data Protection")).toBeVisible();
  });

  test("filters by framework, status, and severity dropdowns", async ({ userPage }) => {
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    // 1. Framework Filter -> select GDPR
    await userPage.click('button:has-text("Framework:")');
    await userPage.click('label:has-text("GDPR") input[type="checkbox"]');
    await userPage.click('button:has-text("Framework: 1")'); // Close dropdown

    await expect(userPage.locator("text=GDPR - Data Protection")).toBeVisible();
    await expect(userPage.locator("text=HIPAA - Access Control")).not.toBeVisible();

    // 2. Status Filter -> select Non-compliant
    await userPage.click('button:has-text("Status:")');
    await userPage.click('label:has-text("Non-compliant") input[type="checkbox"]');
    await userPage.click('button:has-text("Status: 1")'); // Close dropdown

    // 3. Severity Filter -> select CRITICAL
    await userPage.click('button:has-text("Severity:")');
    await userPage.click('label:has-text("CRITICAL") input[type="checkbox"]');
    await userPage.click('button:has-text("Severity: 1")'); // Close dropdown

    // Verify only critical GDPR non-compliant item GDPR-P2.0 is visible
    await userPage.click("text=GDPR - Data Protection");
    await expect(userPage.locator("text=GDPR-P2.0")).toBeVisible();
    await expect(userPage.locator("text=GDPR-D3.1")).not.toBeVisible(); // Medium severity

    // Clear filters
    await userPage.click('button:has-text("Clear all")');
    await expect(userPage.locator("text=HIPAA - Access Control")).toBeVisible();
  });

  test("sorts control checklist items", async ({ userPage }) => {
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    const sortSelect = userPage.locator("select").first();
    await sortSelect.selectOption("id"); // sort by ID

    // Expanded GDPR general group should display on the first page
    await expect(userPage.locator("text=GDPR - General")).toBeVisible();

    await sortSelect.selectOption("severity"); // sort back by severity
    await expect(userPage.locator("text=GDPR - Data Protection")).toBeVisible();
  });

  test("paginates controls", async ({ userPage }) => {
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    // Change per page to 10
    const limitSelect = userPage.locator("div.flex.items-center.gap-2 select");
    await limitSelect.selectOption("10");

    const pagination = userPage.locator("div.border-t").filter({ hasText: "Showing" });

    // Verify pagination indicator text
    await expect(pagination.locator("text=Showing 1-10 of 12 items")).toBeVisible();

    // Go to next page
    await pagination.locator("button:has(svg.lucide-chevron-right)").click();
    await expect(pagination.locator("text=Showing 11-12 of 12 items")).toBeVisible();

    // Previous button should be enabled, next disabled
    const nextBtn = pagination.locator("button:has(svg.lucide-chevron-right)");
    await expect(nextBtn).toBeDisabled();

    // Back to page 1
    await pagination.locator("button:has(svg.lucide-chevron-left)").click();
    await expect(pagination.locator("text=Showing 1-10 of 12 items")).toBeVisible();
  });

  test("updates overall score and progress bar when control status changes", async ({
    userPage,
  }) => {
    await userPage.goto("/assessments");
    await userPage.waitForURL("**/assessments/assessment-1/checklist");

    // Open "GDPR - Data Protection" group
    await userPage.click("text=GDPR - Data Protection");

    // Find the GDPR-P2.0 control card container
    const card = userPage.locator('div.border-l-4:has-text("GDPR-P2.0")');
    await expect(card).toBeVisible();

    // Check starting status is Non-compliant
    const statusBtn = card.getByRole("button", { name: "Non-compliant", exact: true });
    await expect(statusBtn).toBeVisible();

    // Open status dropdown
    await statusBtn.click();

    // Change status to Compliant
    const compliantOption = card.getByRole("button", { name: "Compliant", exact: true });
    await compliantOption.click();

    // Verify the status updates to Compliant
    await expect(card.getByRole("button", { name: "Compliant", exact: true })).toBeVisible();

    // Verify toast notification is displayed
    await expect(userPage.locator("text=Control status updated.")).toBeVisible();

    // Verify Overall Compliance score updates to 37%
    await expect(userPage.locator("text=37% Compliance Rate")).toBeVisible();
  });
});
