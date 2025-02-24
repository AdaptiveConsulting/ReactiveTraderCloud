import { devices, PlaywrightTestConfig } from "@playwright/test"

import { TestTimeout } from "./e2e/utils"

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  workers: 1,
  // Maximum time allowed for each test
  timeout: TestTimeout.NORMAL,
  expect: {
    // Maximum time for expect, default 5s
    // see  https://playwright.dev/docs/test-configuration#expect-options
    // timeout: ExpectTimeout.MEDIUM,
  },
  projects: [
    {
      name: "web",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        //Artifacts
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
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
