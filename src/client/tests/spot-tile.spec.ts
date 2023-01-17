import { expect, Locator } from "@playwright/test"
import * as dotenv from "dotenv"
import { test } from "../fixtures"

dotenv.config()

test.describe("Spot Tile", () => {
  test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async ({
    context,
    fxOpenfinPagesRec,
  }, testInfo) => {
    let button: Locator
    let tradeIdLocator: Locator
    let tradeId: string
    let blotterTradeID: string

    if (testInfo.project.name === "openfin") {
      const mainWindow = fxOpenfinPagesRec["mainWindow"]
      // Openfin runtime is triggered inside evaluate
      await mainWindow.evaluate(async () => {
        const currentWindow = window.fin.desktop.Window.getCurrent()
        currentWindow.maximize()
        return window.fin
      })

      const openfinTile = fxOpenfinPagesRec["fx-tiles"]

      button = openfinTile.locator("[data-testid='Sell-EURUSD']")
      await button.click()

      tradeIdLocator = openfinTile.locator("[data-testid='trade-id']")
      tradeId = await tradeIdLocator.innerText()

      const openfinBlotter = fxOpenfinPagesRec["fx-blotter"]
      blotterTradeID = await openfinBlotter
        .getByRole("cell", { name: tradeId })
        .innerText()
    } else {
      const pages = await context.pages()
      const mainWindow = pages.length > 0 ? pages[0] : await context.newPage()
      await mainWindow.goto(
        `${process.env.URL_PATH ?? "http://localhost:1917/"}`,
      )
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
