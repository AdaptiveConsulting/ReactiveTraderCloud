import type { PlaywrightTestConfig } from "@playwright/test"
import { devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  /* Maximum time one test can run for. */
  timeout: 50 * 1000,
  workers: 5,
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "openfin",
    },
  ],
  // use: {
  //   launchOptions: {
  //     slowMo: 800,
  //   },
  // },
}

export default config
