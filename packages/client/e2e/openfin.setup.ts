import { Page } from "@playwright/test"

import { test as setup } from "./fixtures"

setup("launch fx/credit/limit-checker", async ({ launcherPageRec }) => {
  const launcher:Page = launcherPageRec
  
  await launcher.getByTitle("Launch Reactive Trader®(ENV)").click()
  await launcher.waitForTimeout(5000)

  await launcher.getByTitle("Launch Reactive Trader® Credit(ENV)").click()
  await launcher.waitForTimeout(5000)

  await launcher.getByTitle("Launch Limit Checker").click()
  await launcher.waitForTimeout(10000)
})
