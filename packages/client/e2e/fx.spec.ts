import { expect } from "@playwright/test"

import { test } from "./fixtures"
import { isOpenFin } from "./utils"

test.describe("Fx App", () => {
  test("Views should open new windows when popped out, and reattach to main window when closed", async ({
    context,

    fxPages: { mainPage },
  }, workerInfo) => {
    //TODO either adapt this test for web tear out or write a companion test
    //TODO Test is failing intermittently due to issue documented in RT-5538. Skipping the test until resolved

    test.fixme(!isOpenFin(workerInfo), "openfin only")

    const popOutButtons = mainPage.getByTitle("open in new window")
    const toggleLock = mainPage.getByTitle("toggle layout lock")

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

    await poppedOutLiveRatesPage.getByTestId("openfin-chrome__close").click()

    await expect(mainPage.locator("text=Live Rates")).toBeVisible()
    expect(poppedOutLiveRatesPage.isClosed()).toBeTruthy()

    await poppedOutBlotterPage.getByTestId("openfin-chrome__close").click()

    await expect(mainPage.locator("text=Trades")).toBeVisible()
    expect(poppedOutBlotterPage.isClosed()).toBeTruthy()

    await expect(mainPage.locator("text=Analytics")).toBeVisible()

    await toggleLock.hover()
    await toggleLock.click()

    await expect(popOutButtons).toHaveCount(3)
    await expect(popOutButtons.nth(0)).toBeHidden()
  })
})
