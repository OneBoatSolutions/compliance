import { test as base, Page } from "@playwright/test";

const adminUserCredentials = {
  email: "admin@cipherion.com",
  password: "Admin@123",
};

const regularUserCredentials = {
  email: "user@test.com",
  password: "User@1234",
};

export const test = base.extend<{
  adminUser: typeof adminUserCredentials;
  regularUser: typeof regularUserCredentials;
  loggedInPage: (role: "admin" | "user") => Promise<Page>;
  adminPage: Page;
  userPage: Page;
}>({
  adminUser: async (args, use) => {
    await use(adminUserCredentials);
  },
  regularUser: async (args, use) => {
    await use(regularUserCredentials);
  },
  loggedInPage: async ({ page }, use) => {
    const logIn = async (role: "admin" | "user") => {
      const credentials = role === "admin" ? adminUserCredentials : regularUserCredentials;
      await page.goto("/login");
      await page.fill('input[name="email"]', credentials.email);
      await page.fill('input[name="password"]', credentials.password);
      await page.click('button[type="submit"]');
      if (role === "admin") {
        await page.waitForURL("**/frameworks");
      } else {
        await page.waitForURL("**/dashboard");
      }
      return page;
    };
    await use(logIn);
  },
  adminPage: async ({ page, adminUser }, use) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', adminUser.email);
    await page.fill('input[name="password"]', adminUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/frameworks");
    await use(page);
  },
  userPage: async ({ page, regularUser }, use) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', regularUser.email);
    await page.fill('input[name="password"]', regularUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
    await use(page);
  },
});

export { expect } from "@playwright/test";
export type { Page };
