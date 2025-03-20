import { expect } from "@playwright/test"

import { test } from "./fixtures"
import { FxBlotterPageObject, FxTilesPageObject } from "./pages"

let tilePage: FxTilesPageObject
let blotterPage: FxBlotterPageObject

test.describe("Spot Tile", () => {
  test.beforeAll(async ({ fxPages }) => {
    tilePage = fxPages.fxTilePO
    blotterPage = fxPages.fxBlotterPO
  })

  test.describe("Valid Purchase", () => {
    test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter @smoke", async () => {
      await tilePage.clickCurrency("EUR")

      await tilePage.spotTileNotionalInput.clear()
      await tilePage.spotTileNotionalInput.pressSequentially("1m")

      await tilePage.sell("EURUSD")

      // Wait for execution delay to end
      await expect(tilePage.tradeId).toBeVisible()

      const tradeId = await tilePage.tradeId.innerText()
      const blotterTradeID = await blotterPage.tradesGridRow(tradeId)

      await expect(blotterTradeID).toHaveText(tradeId)
    })

    test("When I buy USD/JPY then a tile displays in green with confirmation message", async () => {
      await tilePage.clickCurrency("USD")

      await tilePage.buy("USDJPY")

      const greenConfirmation = tilePage.page
        .locator("div[role='dialog']")
        .getByText(/You Bought/)
      await expect(greenConfirmation).toBeVisible()
    })
  })

  test.describe("Rejected purchase confirmation", () => {
    test("When I buy GBP/JPY then a tile displays in red with message 'Trade was rejected'", async () => {
      await tilePage.clickCurrency("GBP")

      await tilePage.buy("GBPJPY")

      const redConfirmation = tilePage.page
        .locator("div[role='dialog']")
        .getByText(/Your trade has been rejected/)
      await expect(redConfirmation).toBeVisible()
    })
  })

  test.describe("Timed out transaction", () => {
    test("When I sell EUR/JPY then an execution animation appears until a timed out tile displays in orange with message 'Trade taking longer than expected'", async () => {
      await tilePage.clickCurrency("EUR")

      await tilePage.sell("EURJPY")

      const executingSpinner = tilePage.page.getByText(/Executing/)
      await expect(executingSpinner).toBeVisible()

      const orangeConfirmation = tilePage.page
        .locator("div[role='dialog']")
        .getByText(/Trade execution taking longer than expected/)
      await expect(orangeConfirmation).toBeVisible()
    })
  })

  test.describe("High notional RFQ", () => {
    const SPOT_TILE_RFQ_TIMEOUT = 10500

    test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async () => {
      await tilePage.clickCurrency("NZD")

      await tilePage.page.locator("[data-testid='rfqButton']").click()

      await expect(tilePage.page.getByTestId("rfqTimer")).toBeVisible()
      await tilePage.page.getByTestId("rfqTimer").waitFor({
        state: "hidden",
        timeout: SPOT_TILE_RFQ_TIMEOUT,
      })
      const requoteBtn = tilePage.page.getByText(/Requote/)
      await expect(requoteBtn).toBeVisible({
        timeout: SPOT_TILE_RFQ_TIMEOUT,
      })
    })
  })

  test.describe("Notional value", () => {
    test.beforeAll(async () => {
      await tilePage.clickCurrency("EUR")
    })

    test("When I type 1k as notional value to EUR/USD then notional value should be 1 thousand", async () => {
      await tilePage.spotTileNotionalInput.clear()
      await tilePage.spotTileNotionalInput.pressSequentially("1k")

      await expect(tilePage.spotTileNotionalInput).toHaveValue("1,000")
    })

    test("When I type 1m as notional value to EUR/USD then notional value should be 1 million", async () => {
      await tilePage.spotTileNotionalInput.clear()
      await tilePage.spotTileNotionalInput.pressSequentially("1m")

      await expect(tilePage.spotTileNotionalInput).toHaveValue("1,000,000")
    })

    test("When I enter a number too large (over 1,000,000,000) then an error will appear 'Max exceeded'", async () => {
      await tilePage.spotTileNotionalInput.clear()
      await tilePage.spotTileNotionalInput.pressSequentially("1200000000")
      await expect(tilePage.page.getByText(/Max exceeded/)).toBeVisible()

      await tilePage.spotTileNotionalInput.selectText()
      await tilePage.spotTileNotionalInput.pressSequentially("1m")
      await expect(tilePage.page.getByText(/Max exceeded/)).toBeHidden()
    })
  })

  test.describe("Toggle between prices and graph views", () => {
    test("When I click the graph icon on the Live Rates bar then I should toggle from graph to price views", async () => {
      const toggle = tilePage.page.locator(
        "[data-testid='action-toggleTileView']",
      )

      // first click, goes into normal mode, should be no graphs
      await toggle.click()
      const tileState = await tilePage.page.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      expect(tileState).toBe("Normal")
      await expect(
        tilePage.page.locator("[data-testid='tile-graph']").nth(0),
      ).toBeHidden()

      // click toggleButton again, now expect there to be graphs
      await toggle.click()
      const tileState2 = await tilePage.page.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      expect(tileState2).toBe("Chart")
      await expect(
        tilePage.page.locator("[data-testid='tile-graph']").nth(0),
      ).toBeVisible()
    })
  })

  test.describe("Toggle between tile filters", () => {
    const filterData = [
      { currency: "EUR", numTiles: 4 },
      { currency: "USD", numTiles: 5 },
      { currency: "GBP", numTiles: 2 },
      { currency: "AUD", numTiles: 2 },
      { currency: "NZD", numTiles: 1 },
    ]

    filterData.forEach(({ currency, numTiles }) => {
      test(`When I toggle ${currency} then I should see ${numTiles} tiles testing with `, async () => {
        await tilePage.clickCurrency(currency)
        const totalTiles = await tilePage.page
          .locator('div[aria-label="Lives Rates Tiles"] > div')
          .count()

        expect(totalTiles).toBe(numTiles)
      })
    })
  })
})
