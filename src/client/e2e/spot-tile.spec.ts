import { expect, Locator, Page } from "@playwright/test"
import * as dotenv from "dotenv"
import { test } from "./fixtures"

dotenv.config()

test.describe("Spot Tile", () => {
  test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async ({
    context,
    fxOpenfinPagesRec,
  }, testInfo) => {
    let tilePage: Page
    let blotterPage: Page

    if (testInfo.project.name === "openfin") {
      const mainWindow = fxOpenfinPagesRec["mainWindow"]
      // Openfin runtime is triggered inside evaluate
      await mainWindow.evaluate(async () => {
        const currentWindow = window.fin.desktop.Window.getCurrent()
        currentWindow.maximize()
        return window.fin
      })
      tilePage = fxOpenfinPagesRec["fx-tiles"]
      blotterPage = fxOpenfinPagesRec["fx-blotter"]
    } else {
      const pages = await context.pages()
      const mainWindow = pages.length > 0 ? pages[0] : await context.newPage()
      await mainWindow.goto(
        `${process.env.URL_PATH ?? "http://localhost:1917/"}`,
      )
      tilePage = mainWindow
      blotterPage = mainWindow
    }

    await tilePage.locator("[data-testid='Sell-EURUSD']").click()

    const tradeId = await tilePage
      .locator("[data-testid='trade-id']")
      .innerText()

    const blotterTradeID = await blotterPage
      .getByRole("cell", { name: tradeId })
      .innerText()

    expect(tradeId).toBe(blotterTradeID)
  })
})
