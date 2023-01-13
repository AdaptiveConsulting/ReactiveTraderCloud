import { expect, chromium, Locator } from "@playwright/test"
import { test } from "../fixtures"

test.describe("Spot Tile", () => {
  test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async ({
    openfinTile,
    mainWindow,
    openfinBlotter,
  }, testInfo) => {
    let button: Locator
    let tradeIdLocator: Locator
    let tradeId: string
    let blotterTradeID: string

    if (testInfo.project.name === "openfin") {
      // Openfin runtime is triggered inside evaluate
      await mainWindow.evaluate(async () => {
        const currentWindow = window.fin.desktop.Window.getCurrent()
        currentWindow.maximize()
        return window.fin
      })
      button = openfinTile.locator("[data-testid='Sell-EURUSD']")
      await button.click()

      tradeIdLocator = openfinTile.locator("[data-testid='trade-id']")
      tradeId = await tradeIdLocator.innerText()

      blotterTradeID = await openfinBlotter
        .getByRole("cell", { name: tradeId })
        .innerText()
    } else {
      await mainWindow.goto("http://localhost:1917/")
      button = mainWindow.locator("[data-testid='Sell-EURUSD']")
      await button.click()

      tradeIdLocator = mainWindow.locator("[data-testid='trade-id']")
      tradeId = await tradeIdLocator.innerText()

      blotterTradeID = await mainWindow
        .getByRole("cell", { name: tradeId })
        .innerText()
    }

    expect(tradeId).toBe(blotterTradeID)
  })
})
