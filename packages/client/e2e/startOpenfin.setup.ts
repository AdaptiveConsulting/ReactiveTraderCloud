import { test as setup } from "@playwright/test"
import { exec } from "child_process"

setup("start openfin", async ({ page }) => {
  exec("npm run openfin:start:fx")
  await page.waitForTimeout(30000)
})
