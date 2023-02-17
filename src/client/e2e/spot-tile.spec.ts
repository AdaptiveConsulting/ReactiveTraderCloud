import { expect, Page } from "@playwright/test"
import { test } from "./fixtures"

test.describe("Spot Tile", () => {
  let tilePage: Page
  let blotterPage: Page

  test.beforeAll(async ({ context, fxOpenfinPagesRec }, testInfo) => {
    if (testInfo.project.name === "openfin") {
      const mainWindow = fxOpenfinPagesRec["mainWindow"]
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

      await mainWindow.goto(`${process.env.URL_PATH}`)

      tilePage = mainWindow
      blotterPage = mainWindow
    }
  })

  test.describe("Valid Purchase", () => {
    test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async () => {
      await tilePage.locator("[data-testid='menuButton-EUR']").click()

      await tilePage.locator("[data-testid='Sell-EURUSD']").click()

      const tradeId = await tilePage
        .locator("[data-testid='trade-id']")
        .innerText()

      const blotterTradeID = await blotterPage
        .locator(`[data-testid='trades-grid-row-${tradeId}'] > td`)
        .nth(1)
        .textContent()
      await tilePage.locator("[data-testid='menuButton-ALL']").click()
      expect(tradeId).toBe(blotterTradeID)
    })

    test("When I buy USD/JPY then an Execution screen appears until transaction is performed and tile displays green confirmation screen", async () => {
      await tilePage.locator("[data-testid='Buy-USDJPY']").click()

      const executingSpinner = await tilePage.getByText(/Executing/)
      expect(executingSpinner).not.toBe(null)

      const greenConfirmation = await tilePage
        .locator("div[role='dialog']")
        .getByText(/You bought/)
      expect(greenConfirmation).not.toBe(null)
    })
  })

  test.describe("Rejected purchase confirmation", () => {
    test("When I buy GBP/JPY then an execution screen appears and the tile displays are red with message Trade was rejected", async () => {
      await tilePage.locator("[data-testid='Buy-GBPJPY']").click()

      const executingSpinner = await tilePage.getByText(/Executing/)
      expect(executingSpinner).not.toBe(null)

      const greenConfirmation = await tilePage
        .locator("div[role='dialog']")
        .getByText(/Your trade has been rejected/)
      expect(greenConfirmation).not.toBe(null)
    })
  })

  test.describe("Timed out transaction", () => {
    test.setTimeout(60000)
    test("When I sell EUR/JPY then a timed out message appears with message displays 'Trade taking longer than expected'", async () => {
      await tilePage.locator("[data-testid='Sell-EURJPY']").click()

      const greenConfirmation = await tilePage
        .locator("div[role='dialog']")
        .getByText(/Trade taking longer than expected/)
      expect(greenConfirmation).not.toBe(null)
    })
  })

  test.describe("High notional RFQ", () => {
    test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async () => {
      await tilePage.locator("[data-testid='rfqButton']").click()

      await tilePage.waitForTimeout(10000)

      const requoteBtn = await tilePage.getByText(/Requote/)
      expect(requoteBtn).toBeDefined()
    })
  })

  test.describe("Notional value", () => {
    test("When I type 1k as notional value to EUR/USD then notional value should be 1000", async () => {
      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage.locator("input[id='notional-input-EURUSD']").type("1k")
      const notionalValue = await tilePage
        .locator("input[id='notional-input-EURUSD']")
        .inputValue()
      expect(notionalValue).toEqual("1,000")
    })

    test("When I type 1m as notional value to EUR/USD then notional value should be 1000", async () => {
      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage.locator("input[id='notional-input-EURUSD']").type("1m")
      const notionalValue = await tilePage
        .locator("input[id='notional-input-EURUSD']")
        .inputValue()
      expect(notionalValue).toEqual("1,000,000")
    })

    test("When I enter a number too large (over 1,000,000,000) then an error will appear 'Max exceeded'", async () => {
      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage
        .locator("input[id='notional-input-EURUSD']")
        .type("1200000000")

      const txt = await tilePage.getByText(/Max exceeded/).innerText()
      expect(txt).toEqual("Max exceeded")
      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage.locator("input[id='notional-input-EURUSD']").type("1m")
    })
  })

  test.describe("Toggle between prices and graph views", () => {
    test("When I click the graph icon on the Live Rates bar then I should toggle from graph to price views", async () => {
      const toggle = tilePage.locator("[data-testid='toggleButton']")
      await toggle.click()
      expect(toggle).toHaveCSS("background", "none")
    })
  })

  test.describe("Toggle between tile filters", () => {
    test("When I toggle EUR then I should see 4 tiles", async () => {
      await tilePage.locator("[data-testid='menuButton-EUR']").click()
      const totalEuroTiles = await tilePage
        .locator('div[aria-label="Lives Rates Tiles"] > div')
        .count()

      expect(totalEuroTiles).toBe(4)
    })

    test("When I toggle USD then I should see 5 tiles", async () => {
      await tilePage.locator("[data-testid='menuButton-USD']").click()
      const totalUsdTiles = await tilePage
        .locator('div[aria-label="Lives Rates Tiles"] > div')
        .count()

      expect(totalUsdTiles).toBe(5)
    })

    test("When I toggle GBP then I should see 2 tiles", async () => {
      await tilePage.locator("[data-testid='menuButton-GBP']").click()
      const totalGBPTiles = await tilePage
        .locator('div[aria-label="Lives Rates Tiles"] > div')
        .count()

      expect(totalGBPTiles).toBe(2)
    })

    test("When I toggle AUD then I should see 2 tiles", async () => {
      await tilePage.locator("[data-testid='menuButton-AUD']").click()
      const totalAUD = await tilePage
        .locator('div[aria-label="Lives Rates Tiles"] > div')
        .count()

      expect(totalAUD).toBe(2)
    })

    test("When I toggle NZD then I should see 1 tile", async () => {
      await tilePage.locator("[data-testid='menuButton-NZD']").click()
      const totalNZDTiles = await tilePage
        .locator('div[aria-label="Lives Rates Tiles"] > div')
        .count()
      expect(totalNZDTiles).toBe(1)
      await tilePage.locator("[data-testid='menuButton-ALL']").click()
    })
  })
})
