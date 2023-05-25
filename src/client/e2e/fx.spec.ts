import { expect, selectors } from "@playwright/test"
import { Page } from "playwright"

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
  })

  test("Views should open new windows when popped out, and reattach to main window when closed", async ({
    context,
  }, testInfo) => {
    test.skip(testInfo.project.name !== OPENFIN_PROJECT_NAME)
    await mainWindow.getByTitle("toggle layout lock").click()

    const popOutTitle = "open in new window"
    const popOutButtons = mainWindow.getByTitle(popOutTitle)

    const liveRatesPagePromise = context.waitForEvent("page")
    await popOutButtons.nth(0).click()
    const poppedOutLiveRatesPage = await liveRatesPagePromise

    await poppedOutLiveRatesPage.waitForSelector("text=Live Rates")

    const blotterPagePromise = context.waitForEvent("page")
    await popOutButtons.nth(0).click()
    const poppedOutBlotterPage = await blotterPagePromise

    await poppedOutBlotterPage.waitForSelector("text=Trades")

    selectors.setTestIdAttribute("data-qa")

    await poppedOutLiveRatesPage.getByTestId("openfin-chrome__close").click()

    expect(await mainWindow.waitForSelector("text=Live Rates")).toBeTruthy()

    await poppedOutBlotterPage.getByTestId("openfin-chrome__close").click()

    expect(await mainWindow.waitForSelector("text=Trades")).toBeTruthy()
    expect(await mainWindow.waitForSelector("text=Analytics")).toBeTruthy()
  })
})
