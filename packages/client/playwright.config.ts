import type { PlaywrightTestConfig } from "@playwright/test"
import { devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  /* Maximum time one test can run for. */
  timeout: 30_000,
  workers: 1,
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        //Artifacts
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
        headless: true,
      },
    },
    {
      name: "openfin",
      use: {
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "local",
      testDir: "./playwright/tests",
      use: {
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
        baseURL: "http://localhost:1917/",
      },
    },
    {
      name: "QA",
      testDir: "./playwright/tests",
      use: {
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
        baseURL: "https://web.dev.reactivetrader.com",
      },
    },
  ],
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:1917",
    reuseExistingServer: true,
  },
}

export default config
