import { test, expect } from "./fixtures";
import { setupMocks } from "./mocks";
import { prisma } from "../../lib/prisma";

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

test.describe("Admin User Management", () => {
  let mockUsersList: MockUser[] = [];
  let loggedInUserId = "admin-id-1"; // Fallback, will be updated dynamically

  test.beforeEach(async ({ page }) => {
    // 1. Setup standard mocks for AI and evidence upload
    await setupMocks(page);

    // 2. Fetch actual logged-in admin ID from database
    try {
      const adminDbUser = await prisma.user.findUnique({
        where: { email: "admin@cipherion.com" },
      });
      if (adminDbUser) {
        loggedInUserId = adminDbUser.id;
      }
    } catch (e) {
      console.warn("Could not retrieve admin ID from database, using default ID", e);
    }

    // 3. Re-initialize mock database for each test to ensure full isolation
    mockUsersList = [
      {
        id: loggedInUserId,
        email: "admin@cipherion.com",
        name: "Cipherion Admin",
        role: "ADMIN",
        isActive: true,
        createdAt: "2026-05-01T10:00:00.000Z",
        lastLoginAt: "2026-05-31T18:00:00.000Z",
      },
      {
        id: "user-id-2",
        email: "john@cipherion.com",
        name: "John Carter",
        role: "USER",
        isActive: true,
        createdAt: "2026-05-02T10:00:00.000Z",
        lastLoginAt: "2026-05-31T19:00:00.000Z",
      },
      {
        id: "user-id-3",
        email: "maria@cipherion.com",
        name: "Maria Vunina",
        role: "USER",
        isActive: false,
        createdAt: "2026-05-03T10:00:00.000Z",
        lastLoginAt: null,
      },
      {
        id: "user-id-4",
        email: "ryan@cipherion.com",
        name: "Ryan Hall",
        role: "USER",
        isActive: true,
        createdAt: "2026-05-04T10:00:00.000Z",
        lastLoginAt: null,
      },
    ];

    // 4. Intercept GET and POST /api/admin/users
    await page.route("**/api/admin/users*", async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        const url = new URL(route.request().url());
        const search = url.searchParams.get("search") || "";
        const role = url.searchParams.get("role") || "";
        const isActiveStr = url.searchParams.get("isActive") || "";
        const pageNum = parseInt(url.searchParams.get("page") || "1", 10);
        const limitNum = parseInt(url.searchParams.get("limit") || "10", 10);

        const filtered = mockUsersList.filter((u) => {
          if (role && u.role !== role) {
            return false;
          }
          if (isActiveStr) {
            const isAct = isActiveStr === "true";
            if (u.isActive !== isAct) {
              return false;
            }
          }
          if (search) {
            const s = search.toLowerCase();
            const matchesName = u.name.toLowerCase().includes(s);
            const matchesEmail = u.email.toLowerCase().includes(s);
            if (!matchesName && !matchesEmail) {
              return false;
            }
          }
          return true;
        });

        // Default sorting is by createdAt descending
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limitNum));
        const startIndex = (pageNum - 1) * limitNum;
        const items = filtered.slice(startIndex, startIndex + limitNum);

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              items,
              meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
              },
            },
          }),
        });
      } else if (method === "POST") {
        const body = JSON.parse(route.request().postData() || "{}");
        const { email, name, role: userRole, password } = body;

        if (!email || !name || !userRole || !password) {
          await route.fulfill({
            status: 422,
            contentType: "application/json",
            body: JSON.stringify({ success: false, error: "Validation failed" }),
          });
          return;
        }

        if (mockUsersList.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          await route.fulfill({
            status: 409,
            contentType: "application/json",
            body: JSON.stringify({
              success: false,
              error: "Email already registered",
              message: "Email already registered",
            }),
          });
          return;
        }

        const newUser = {
          id: `user-id-${Date.now()}`,
          email,
          name,
          role: userRole,
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
        };
        mockUsersList.push(newUser);

        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: newUser }),
        });
      } else {
        await route.continue();
      }
    });

    // 5. Intercept PATCH/DELETE for /api/admin/users/:id
    await page.route(/\/api\/admin\/users\/([^/]+)$/, async (route) => {
      const method = route.request().method();
      const url = route.request().url();
      const matches = url.match(/\/api\/admin\/users\/([^/]+)$/);
      const targetId = matches ? matches[1] : "";

      const userIndex = mockUsersList.findIndex((u) => u.id === targetId);
      if (userIndex === -1) {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: "User not found" }),
        });
        return;
      }

      if (method === "PATCH") {
        const body = JSON.parse(route.request().postData() || "{}");
        const { role: newRole, isActive: newIsActive } = body;

        // Self-sabotage blocker check
        if (targetId === loggedInUserId) {
          if (newRole === "USER" || newIsActive === false) {
            await route.fulfill({
              status: 400,
              contentType: "application/json",
              body: JSON.stringify({
                success: false,
                message: "You cannot demote or deactivate your own account",
              }),
            });
            return;
          }
        }

        // Last admin blocker check
        const targetUser = mockUsersList[userIndex];
        const isCurrentlyAdmin = targetUser.role === "ADMIN";
        const willNoLongerBeAdmin =
          (newRole === "USER" && isCurrentlyAdmin) || (newIsActive === false && isCurrentlyAdmin);
        if (willNoLongerBeAdmin) {
          const activeAdminCount = mockUsersList.filter(
            (u) => u.role === "ADMIN" && u.isActive,
          ).length;
          if (activeAdminCount <= 1) {
            await route.fulfill({
              status: 400,
              contentType: "application/json",
              body: JSON.stringify({ success: false, message: "Cannot remove the last admin" }),
            });
            return;
          }
        }

        if (newRole !== undefined) {
          mockUsersList[userIndex].role = newRole;
        }
        if (newIsActive !== undefined) {
          mockUsersList[userIndex].isActive = newIsActive;
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: mockUsersList[userIndex] }),
        });
      } else if (method === "DELETE") {
        if (targetId === loggedInUserId) {
          await route.fulfill({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({ success: false, message: "You cannot delete your own account" }),
          });
          return;
        }

        const targetUser = mockUsersList[userIndex];
        if (targetUser.role === "ADMIN") {
          const adminCount = mockUsersList.filter((u) => u.role === "ADMIN").length;
          if (adminCount <= 1) {
            await route.fulfill({
              status: 400,
              contentType: "application/json",
              body: JSON.stringify({ success: false, message: "Cannot delete the last admin" }),
            });
            return;
          }
        }

        mockUsersList.splice(userIndex, 1);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: true }),
        });
      } else {
        await route.continue();
      }
    });

    // 6. Intercept POST /api/admin/users/:id/reset-password
    await page.route(/\/api\/admin\/users\/([^/]+)\/reset-password$/, async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: { message: "Password reset email sent" } }),
        });
      } else {
        await route.continue();
      }
    });
  });

  // Access Control redirection test
  test("regular user is redirected to dashboard when accessing admin user management", async ({
    userPage,
  }) => {
    await userPage.goto("/admin/users");
    await userPage.waitForURL("**/dashboard");
    expect(userPage.url()).toContain("/dashboard");
  });

  // Admin user management workspace tests
  test("admin can view user directory with mock users list in correct sorted order", async ({
    adminPage,
  }) => {
    await adminPage.goto("/admin/users");
    await expect(adminPage.getByRole("heading", { name: "User Administration" })).toBeVisible();
    await expect(adminPage.getByText("Active Directory")).toBeVisible();

    const rows = adminPage.locator("table tbody tr");
    await expect(rows).toHaveCount(4);

    // Verify sort order: createdAt desc
    // Row 0: Ryan Hall (2026-05-04)
    // Row 1: Maria Vunina (2026-05-03)
    // Row 2: John Carter (2026-05-02)
    // Row 3: Cipherion Admin (2026-05-01)
    await expect(rows.nth(0)).toContainText("Ryan Hall");
    await expect(rows.nth(1)).toContainText("Maria Vunina");
    await expect(rows.nth(2)).toContainText("John Carter");
    await expect(rows.nth(3)).toContainText("Cipherion Admin");

    // "You" badge should be present next to current logged-in admin's name
    await expect(rows.nth(3).locator("text=You")).toBeVisible();
  });

  test("admin can search users by name or email", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    await adminPage.locator('input[placeholder*="Search users"]').fill("john");
    const rows = adminPage.locator("table tbody tr");

    // Verify list is filtered
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("John Carter");
  });

  test("admin can filter users by role and status", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    // Filter by Role: Admin
    await adminPage.locator("select").first().selectOption("ADMIN");
    let rows = adminPage.locator("table tbody tr");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("Cipherion Admin");

    // Filter by Status: Inactive
    await adminPage.locator("select").first().selectOption(""); // reset
    await adminPage.locator("select").nth(1).selectOption("false");
    rows = adminPage.locator("table tbody tr");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("Maria Vunina");
    await expect(rows.first().getByText("Inactive")).toBeVisible();
  });

  test("admin can clear active filters", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    await adminPage.locator('input[placeholder*="Search users"]').fill("john");
    await adminPage.locator("select").first().selectOption("USER");
    await expect(adminPage.locator("table tbody tr")).toHaveCount(1);

    await adminPage.getByRole("button", { name: "Clear Filters" }).click();

    // Verify fields reset and all users are visible again
    await expect(adminPage.locator('input[placeholder*="Search users"]')).toHaveValue("");
    await expect(adminPage.locator("select").first()).toHaveValue("");
    await expect(adminPage.locator("table tbody tr")).toHaveCount(4);
  });

  test("admin can successfully create a new user", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");
    await adminPage.getByRole("button", { name: "Create New User" }).click();

    await expect(adminPage.getByRole("heading", { name: "Create New User" })).toBeVisible();

    await adminPage.locator('input[name="name"]').fill("Bob New");
    await adminPage.locator('input[name="email"]').fill("bobnew@cipherion.com");
    await adminPage.locator('select[name="role"]').selectOption("USER");
    await adminPage.locator('input[name="password"]').fill("ValidPass@123");

    await adminPage.getByRole("button", { name: "Create User", exact: true }).click();

    // Verify success notification and list updates
    await expect(adminPage.getByText("User created successfully")).toBeVisible();
    await expect(adminPage.locator("table tbody tr")).toHaveCount(5);
    await expect(adminPage.locator("table tbody tr").first()).toContainText("Bob New");
  });

  test("create user form validation displays correct error messages", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");
    await adminPage.getByRole("button", { name: "Create New User" }).click();

    // Submit empty form
    await adminPage.getByRole("button", { name: "Create User", exact: true }).click();

    await expect(adminPage.getByText("Invalid email")).toBeVisible();
    await expect(
      adminPage.getByText("Too small: expected string to have >=2 characters"),
    ).toBeVisible();

    // Submit with weak password
    await adminPage.locator('input[name="password"]').fill("123");
    await adminPage.getByRole("button", { name: "Create User", exact: true }).click();
    await expect(adminPage.getByText("Password must be at least 8 characters")).toBeVisible();
  });

  test("create user form displays API error on duplicate email", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");
    await adminPage.getByRole("button", { name: "Create New User" }).click();

    await adminPage.locator('input[name="name"]').fill("Bob New");
    await adminPage.locator('input[name="email"]').fill("john@cipherion.com"); // Duplicate
    await adminPage.locator('select[name="role"]').selectOption("USER");
    await adminPage.locator('input[name="password"]').fill("ValidPass@123");

    await adminPage.getByRole("button", { name: "Create User", exact: true }).click();
    await expect(adminPage.getByText("Email already registered")).toBeVisible();
  });

  test("admin can edit another user's role", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    const johnRow = adminPage.locator("tr").filter({ hasText: "john@cipherion.com" });
    await johnRow.locator("button").first().click();

    await expect(adminPage.getByRole("heading", { name: "Edit User Profile" })).toBeVisible();

    // Change role
    await adminPage.locator('select[name="role"]').selectOption("ADMIN");
    await adminPage.getByRole("button", { name: "Save Changes" }).click();

    await expect(adminPage.getByText("User updated successfully")).toBeVisible();
    await expect(johnRow.getByText("ADMIN")).toBeVisible();
  });

  test("admin can deactivate user and sees deactivation warning", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    const johnRow = adminPage.locator("tr").filter({ hasText: "john@cipherion.com" });
    await johnRow.locator("button").first().click();

    // Select Inactive
    await adminPage.locator('select[name="isActive"]').selectOption("false");

    // Deactivation warning should render
    await expect(adminPage.getByText("Deactivation Warning")).toBeVisible();
    await expect(
      adminPage.getByText("Deactivating this user will immediately revoke all access permissions"),
    ).toBeVisible();

    await adminPage.getByRole("button", { name: "Save Changes" }).click();

    await expect(adminPage.getByText("User updated successfully")).toBeVisible();
    await expect(johnRow.getByText("Inactive")).toBeVisible();
  });

  test("admin is blocked from self-deactivation and self-demotion", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    const adminRow = adminPage.locator("tr").filter({ hasText: "admin@cipherion.com" });
    await adminRow.locator("button").first().click();

    await expect(adminPage.getByRole("heading", { name: "Edit User Profile" })).toBeVisible();

    const dialog = adminPage.getByRole("dialog");

    // Role select is disabled, demote blocker warning is visible
    const roleSelect = dialog.locator("select").first();
    await expect(roleSelect).toBeDisabled();
    await expect(adminPage.getByText("You cannot demote your own account.")).toBeVisible();

    // Account Status select is disabled, deactivate blocker warning is visible
    const statusSelect = dialog.locator("select").nth(1);
    await expect(statusSelect).toBeDisabled();
    await expect(adminPage.getByText("You cannot deactivate your own account.")).toBeVisible();

    // Delete User action button is disabled for self
    const deleteBtn = adminPage.getByRole("button", { name: "Delete User" });
    await expect(deleteBtn).toBeDisabled();
  });

  test("admin can delete another user after confirmation", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    const johnRow = adminPage.locator("tr").filter({ hasText: "john@cipherion.com" });
    await johnRow.locator("button").first().click();

    await adminPage.getByRole("button", { name: "Delete User" }).click();

    // Warning confirmation modal opens
    await expect(adminPage.getByText("Delete User Warning")).toBeVisible();
    await expect(adminPage.getByText("This action cannot be undone")).toBeVisible();

    await adminPage.getByRole("button", { name: "Confirm Delete" }).click();

    await expect(adminPage.getByText("User deleted successfully")).toBeVisible();
    await expect(adminPage.locator("tr").filter({ hasText: "john@cipherion.com" })).toHaveCount(0);
  });

  test("admin can trigger password reset link for user", async ({ adminPage }) => {
    await adminPage.goto("/admin/users");

    const johnRow = adminPage.locator("tr").filter({ hasText: "john@cipherion.com" });
    // Reset password is the second button
    await johnRow.locator("button").nth(1).click();

    await expect(
      adminPage.getByText("Password reset link sent to John Carter's email (john@cipherion.com)"),
    ).toBeVisible();
  });
});
