import type {PlaywrightTestConfig} from "@playwright/test"
import {devices} from "@playwright/test"

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  /* Maximum time one test can run for. */
  timeout: 50 * 1000,
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
  // use: {
  //   launchOptions: {
  //     slowMo: 800,
  //   },
  // },
}

export default config
