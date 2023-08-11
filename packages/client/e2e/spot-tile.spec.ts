import { expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { OPENFIN_PROJECT_NAME } from "./utils"

test.describe("Spot Tile", () => {
  let tilePage: Page
  let blotterPage: Page

  test.beforeAll(async ({ context, fxPagesRec }, testInfo) => {
    if (testInfo.project.name === OPENFIN_PROJECT_NAME) {
      tilePage = fxPagesRec["fx-tiles"]
      blotterPage = fxPagesRec["fx-blotter"]
    } else {
      const pages = context.pages()
      const mainWindow = pages.length > 0 ? pages[0] : await context.newPage()

      await mainWindow.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)

      tilePage = mainWindow
      blotterPage = mainWindow
    }
  })

  test.describe("Valid Purchase", () => {
    test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter @smoke", async () => {
      await tilePage.locator("[data-testid='menuButton-EUR']").click()

      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage.locator("input[id='notional-input-EURUSD']").type("1m")

      await tilePage.locator("[data-testid='Sell-EURUSD']").click()

      const tradeId = await tilePage
        .locator("[data-testid='trade-id']")
        .innerText()

      const blotterTradeID = await blotterPage
        .locator(`[data-testid='trades-grid-row-${tradeId}'] > div`)
        .nth(1)
        .textContent()
      await tilePage.locator("[data-testid='menuButton-ALL']").click()
      expect(tradeId).toBe(blotterTradeID)
    })

    test("When I buy USD/JPY then a tile displays in green with confirmation message", async () => {
      await tilePage.locator("[data-testid='Buy-USDJPY']").click()

      const greenConfirmation = tilePage
        .locator("div[role='dialog']")
        .getByText(/You bought/)
      await expect(greenConfirmation).toBeVisible()
    })
  })

  test.describe("Rejected purchase confirmation", () => {
    test("When I buy GBP/JPY then a tile displays in red with message 'Trade was rejected'", async () => {
      await tilePage.locator("[data-testid='Buy-GBPJPY']").click()

      const redConfirmation = tilePage
        .locator("div[role='dialog']")
        .getByText(/Your trade has been rejected/)
      await expect(redConfirmation).toBeVisible()
    })
  })

  test.describe("Timed out transaction", () => {
    test.setTimeout(10000)
    test("When I sell EUR/JPY then an execution animation appears until a timed out tile displays in orange with message 'Trade taking longer than expected'", async () => {
      await tilePage.locator("[data-testid='Sell-EURJPY']").click()

      const executingSpinner = tilePage.getByText(/Executing/)
      await expect(executingSpinner).toBeVisible()

      const orangeConfirmation = await tilePage
        .locator("div[role='dialog']")
        .getByText(/Trade execution taking longer than expected/)
      await expect(orangeConfirmation).toBeVisible()
    })
  })

  test.describe("High notional RFQ", () => {
    test.setTimeout(15000)
    test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async () => {
      await tilePage.locator("[data-testid='rfqButton']").click()

      await expect(tilePage.getByTestId("rfqTimer")).toBeVisible()
      await tilePage.getByTestId("rfqTimer").waitFor({state: "hidden", timeout: 10500})
      const requoteBtn = tilePage.getByText(/Requote/)
      await expect (requoteBtn).toBeVisible({timeout: 100})
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

    test("When I type 1m as notional value to EUR/USD then notional value should be 1,000,000", async () => {
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
      await expect(tilePage.getByText(/Max exceeded/)).toBeVisible()

      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage
        .locator("input[id='notional-input-EURUSD']")
        .type("1m")
      await expect(tilePage.getByText(/Max exceeded/)).not.toBeVisible()
    })
  })

  test.describe("Toggle between prices and graph views", () => {
    test("When I click the graph icon on the Live Rates bar then I should toggle from graph to price views", async () => {
      const toggle = tilePage.locator("[data-testid='toggleButton']")
      // first click, goes into normal mode, should be no graphs
      await toggle.click()
      const tileState = await tilePage.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      await expect(tileState).toBe("Normal")
      await expect(
        tilePage.locator("[data-testid='tile-graph']").nth(0),
      ).toBeHidden()
      // click toggleButton again, now expect there to be graphs
      await toggle.click()
      const tileState2 = await tilePage.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      await expect(tileState2).toBe("Analytics")
      await expect(
        tilePage.locator("[data-testid='tile-graph']").nth(0),
      ).toBeVisible()
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
