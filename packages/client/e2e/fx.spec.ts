import { expect, Page, selectors } from "@playwright/test"

import { test } from "./fixtures"
import { OPENFIN_PROJECT_NAME } from "./utils"

test.describe("Fx App", () => {
  let mainWindow: Page
  let tilePage: Page
  let blotterPage: Page

  test.beforeAll(async ({ context, fxPagesRec }, testInfo) => {
    if (testInfo.project.name === OPENFIN_PROJECT_NAME) {
      mainWindow = fxPagesRec["mainWindow"]
      tilePage = fxPagesRec["fx-tiles"]
      blotterPage = fxPagesRec["fx-blotter"]
    } else {
      const pages = context.pages()
      mainWindow = pages.length > 0 ? pages[0] : await context.newPage()

      await mainWindow.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)

      tilePage = mainWindow
      blotterPage = mainWindow
    }
    selectors.setTestIdAttribute("data-qa")
  })

  test.skip("Views should open new windows when popped out, and reattach to main window when closed", async ({
    context,
  }, testInfo) => {
    //TODO either adapt this test for web tear out or write a companion test
    //TODO Test is failing intermittently due to issue documented in RT-5538. Skipping the test until resolved

    test.skip(testInfo.project.name !== OPENFIN_PROJECT_NAME)

    const popOutButtons = mainWindow.getByTitle("open in new window")
    const toggleLock = mainWindow.getByTitle("toggle layout lock")

    await expect(popOutButtons).toHaveCount(3)
    await expect(popOutButtons.nth(0)).not.toBeVisible()

    await toggleLock.hover()
    await toggleLock.click()

    const liveRatesPagePromise = context.waitForEvent("page")
    await popOutButtons.nth(0).click()
    const poppedOutLiveRatesPage = await liveRatesPagePromise
    await poppedOutLiveRatesPage.waitForSelector("text=Live Rates")

    const blotterPagePromise = context.waitForEvent("page")
    await popOutButtons.nth(0).click()
    const poppedOutBlotterPage = await blotterPagePromise
    await poppedOutBlotterPage.waitForSelector("text=Trades")

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
    await expect(popOutButtons.nth(0)).not.toBeVisible()
  })
})
