import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Read environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const port = process.env.PORT || 3000;
const baseURL = process.env.NEXTAUTH_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results-new",
  fullyParallel: false, // Turn off fully parallel to avoid db lock collision during test runs
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Keep workers to 1 to prevent parallel db write conflicts
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      DISABLE_RATE_LIMIT: "true",
    },
  },
});
