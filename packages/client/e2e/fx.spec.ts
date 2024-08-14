import { expect, Page, selectors } from "@playwright/test"

import { test } from "./fixtures"
import { isOpenFin } from "./utils"

test.describe("Fx App", () => {
  let mainWindow: Page

  test.beforeAll(async ({ context, fxPagesRec }, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      mainWindow = fxPagesRec["mainWindow"]
    } else {
      const pages = context.pages()
      mainWindow = pages.length > 0 ? pages[0] : await context.newPage()

      await mainWindow.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)
    }
    selectors.setTestIdAttribute("data-qa")
  })

  test("Views should open new windows when popped out, and reattach to main window when closed", async ({
    context,
  }, workerInfo) => {
    //TODO either adapt this test for web tear out or write a companion test
    //TODO Test is failing intermittently due to issue documented in RT-5538. Skipping the test until resolved

    test.fixme(!isOpenFin(workerInfo), "openfin only")

    const popOutButtons = mainWindow.getByTitle("open in new window")
    const toggleLock = mainWindow.getByTitle("toggle layout lock")

    await expect(popOutButtons).toHaveCount(3)
    await expect(popOutButtons.nth(0)).toBeHidden()

    await toggleLock.hover()
    await toggleLock.click()

    const liveRatesPagePromise = context.waitForEvent("page")
    await popOutButtons.nth(0).click()
    const poppedOutLiveRatesPage = await liveRatesPagePromise
    await expect(
      poppedOutLiveRatesPage.locator("div").getByText("Live Rates"),
    ).toBeVisible()

    const blotterPagePromise = context.waitForEvent("page")
    await popOutButtons.nth(0).click()
    const poppedOutBlotterPage = await blotterPagePromise
    await expect(
      poppedOutBlotterPage.locator("div").getByText("Trades"),
    ).toBeVisible()

    await poppedOutLiveRatesPage
      .locator("[data-qa='openfin-chrome__close']")
      .click()

    await expect(mainWindow.locator("text=Live Rates")).toBeVisible()
    expect(poppedOutLiveRatesPage.isClosed()).toBeTruthy()

    await poppedOutBlotterPage
      .locator("[data-qa='openfin-chrome__close']")
      .click()

    await expect(mainWindow.locator("text=Trades")).toBeVisible()
    expect(poppedOutBlotterPage.isClosed()).toBeTruthy()

    await expect(mainWindow.locator("text=Analytics")).toBeVisible()

    await toggleLock.hover()
    await toggleLock.click()

    await expect(popOutButtons).toHaveCount(3)
    await expect(popOutButtons.nth(0)).toBeHidden()
  })
})
