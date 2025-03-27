import { expect } from "@playwright/test"

import { test } from "./fixtures"

test.describe("Spot Tile", () => {
  test.describe("Valid Purchase", () => {
    test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter @smoke", async ({
      fxPages: { tilePO, blotterPO },
    }) => {
      await tilePO.selectFilter("EUR")

      await tilePO.notionalInput("EURUSD").clear()
      await tilePO.notionalInput("EURUSD").pressSequentially("1m")

      await tilePO.sell("EURUSD")

      // Wait for execution delay to end
      await expect(tilePO.tradeId).toBeVisible()

      const tradeId = await tilePO.tradeId.innerText()
      const blotterTradeID = blotterPO.tradesGridRow(tradeId)

      await expect(blotterTradeID).toHaveText(tradeId)
    })

    test("When I buy USD/JPY then a tile displays in green with confirmation message", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.selectFilter("USD")

      await tilePO.buy("USDJPY")

      const greenConfirmation = tilePO.dialogText(/You Bought/)
      await expect(greenConfirmation).toBeVisible()
    })
  })

  test.describe("Rejected purchase confirmation", () => {
    test("When I buy GBP/JPY then a tile displays in red with message 'Trade was rejected'", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.selectFilter("GBP")

      await tilePO.buy("GBPJPY")

      const redConfirmation = tilePO.dialogText("Your trade has been rejected")
      await expect(redConfirmation).toBeVisible()
    })
  })

  test.describe("Timed out transaction", () => {
    test("When I sell EUR/JPY then an execution animation appears until a timed out tile displays in orange with message 'Trade taking longer than expected'", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.selectFilter("EUR")

      await tilePO.sell("EURJPY")

      const executingSpinner = tilePO.textValue("Executing")
      await expect(executingSpinner).toBeVisible()

      const orangeConfirmation = tilePO.dialogText(
        "Trade execution taking longer than expected",
      )
      await expect(orangeConfirmation).toBeVisible()
    })
  })

  test.describe("High notional RFQ", () => {
    const SPOT_TILE_RFQ_TIMEOUT = 10500

    test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.selectFilter("NZD")

      await tilePO.rfqButton.click()

      await expect(tilePO.rfqTimer).toBeVisible()
      await tilePO.rfqTimer.waitFor({
        state: "hidden",
        timeout: SPOT_TILE_RFQ_TIMEOUT,
      })
      const requoteBtn = tilePO.textValue("Requote")
      await expect(requoteBtn).toBeVisible({
        timeout: SPOT_TILE_RFQ_TIMEOUT,
      })
    })
  })

  test.describe("Notional value", () => {
    test.beforeAll(async ({ fxPages: { tilePO } }) => {
      await tilePO.selectFilter("EUR")
    })

    test("When I type 1k as notional value to EUR/USD then notional value should be 1 thousand", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.notionalInput("EURUSD").clear()
      await tilePO.notionalInput("EURUSD").pressSequentially("1k")

      await expect(tilePO.notionalInput("EURUSD")).toHaveValue("1,000")
    })

    test("When I type 1m as notional value to EUR/USD then notional value should be 1 million", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.notionalInput("EURUSD").clear()
      await tilePO.notionalInput("EURUSD").pressSequentially("1m")

      await expect(tilePO.notionalInput("EURUSD")).toHaveValue("1,000,000")
    })

    test("When I enter a number too large (over 1,000,000,000) then an error will appear 'Max exceeded'", async ({
      fxPages: { tilePO },
    }) => {
      await tilePO.notionalInput("EURUSD").clear()
      await tilePO.notionalInput("EURUSD").pressSequentially("1200000000")
      await expect(tilePO.page.getByText(/Max exceeded/)).toBeVisible()

      await tilePO.notionalInput("EURUSD").selectText()
      await tilePO.notionalInput("EURUSD").pressSequentially("1m")
      await expect(tilePO.page.getByText(/Max exceeded/)).toBeHidden()
    })
  })

  test.describe("Toggle between prices and graph views", () => {
    test("When I click the graph icon on the Live Rates bar then I should toggle from graph to price views", async ({
      fxPages: { tilePO },
    }) => {
      const toggle = tilePO.page.locator(
        "[data-testid='action-toggleTileView']",
      )

      // first click, goes into normal mode, should be no graphs
      await toggle.click()
      const tileState = await tilePO.page.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      expect(tileState).toBe("Normal")
      await expect(
        tilePO.page.locator("[data-testid='tile-graph']").nth(0),
      ).toBeHidden()

      // click toggleButton again, now expect there to be graphs
      await toggle.click()
      const tileState2 = await tilePO.page.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      expect(tileState2).toBe("Chart")
      await expect(
        tilePO.page.locator("[data-testid='tile-graph']").nth(0),
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
      test(`When I toggle ${currency} then I should see ${numTiles} tiles testing with `, async ({
        fxPages: { tilePO },
      }) => {
        await tilePO.selectFilter(currency)
        const totalTiles = await tilePO.page
          .locator('div[aria-label="Lives Rates Tiles"] > div')
          .count()

        expect(totalTiles).toBe(numTiles)
      })
    })
  })
})
