import type { PlaywrightTestConfig } from "@playwright/test"
import { devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
  testDir: "./playwright/tests",
  timeout: 30_000,
  workers: 1,
  projects: [
    {
      name: "local",
      use: {
        ...devices["Desktop Chrome"],
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
        baseURL: "http://localhost:1917/",
      },
    },
    {
      name: "dev",
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
        open: "on-failure",
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
