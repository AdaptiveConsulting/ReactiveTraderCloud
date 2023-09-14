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
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run openfin:dev',
    port:1917,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
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
  // use: {
  //   launchOptions: {
  //     slowMo: 800,
  //   },
  // },
}

export default config
