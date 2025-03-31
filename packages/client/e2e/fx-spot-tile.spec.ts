import { expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { isOpenFin } from "./utils"

test.describe("Spot Tile", () => {
  let tilePage: Page
  let blotterPage: Page

  test.beforeAll(async ({ context, fxPages }, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      tilePage = fxPages["fx-tiles"]
      blotterPage = fxPages["fx-blotter"]
      tilePage.setViewportSize({ width: 1280, height: 1024 })
      blotterPage.setViewportSize({ width: 1280, height: 1024 })
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
      await tilePage.getByTestId("tab-bar-tabs").getByText("EUR").click()

      const spotTileNotionalInput = tilePage.locator(
        "input[id='notional-input-EURUSD']",
      )
      await spotTileNotionalInput.clear()
      await spotTileNotionalInput.pressSequentially("1m")

      await tilePage.locator("[data-testid='Sell-EURUSD']").click()

      // Wait for execution delay to end
      await expect(tilePage.locator("[data-testid='trade-id']")).toBeVisible()

      const tradeId = await tilePage
        .locator("[data-testid='trade-id']")
        .innerText()

      const blotterTradeID = blotterPage
        .locator(`[data-testid='trades-grid-row-${tradeId}'] > div`)
        .nth(1)
      await expect(blotterTradeID).toHaveText(tradeId)
    })

    test("When I buy USD/JPY then a tile displays in green with confirmation message", async () => {
      await tilePage.getByTestId("tab-bar-tabs").getByText("USD").click()

      await tilePage.locator("[data-testid='Buy-USDJPY']").click()

      const greenConfirmation = tilePage
        .locator("div[role='dialog']")
        .getByText(/You Bought/)
      await expect(greenConfirmation).toBeVisible()
    })
  })

  test.describe("Rejected purchase confirmation", () => {
    test("When I buy GBP/JPY then a tile displays in red with message 'Trade was rejected'", async () => {
      await tilePage.getByTestId("tab-bar-tabs").getByText("GBP").click()

      await tilePage.locator("[data-testid='Buy-GBPJPY']").click()

      const redConfirmation = tilePage
        .locator("div[role='dialog']")
        .getByText(/Your trade has been rejected/)
      await expect(redConfirmation).toBeVisible()
    })
  })

  test.describe("Timed out transaction", () => {
    test("When I sell EUR/JPY then an execution animation appears until a timed out tile displays in orange with message 'Trade taking longer than expected'", async () => {
      await tilePage.getByTestId("tab-bar-tabs").getByText("EUR").click()

      await tilePage.locator("[data-testid='Sell-EURJPY']").click()

      const executingSpinner = tilePage.getByText(/Executing/)
      await expect(executingSpinner).toBeVisible()

      const orangeConfirmation = tilePage
        .locator("div[role='dialog']")
        .getByText(/Trade execution taking longer than expected/)
      await expect(orangeConfirmation).toBeVisible()
    })
  })

  const SPOT_TILE_RFQ_TIMEOUT = 10500
  const SPOT_RFQ_REQUOTE_TIMEOUT = 100

  test.describe("High notional RFQ", () => {
    test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async () => {
      await tilePage.getByTestId("tab-bar-tabs").getByText("NZD").click()

      await tilePage.locator("[data-testid='rfqButton']").click()

      await expect(tilePage.getByTestId("rfqTimer")).toBeVisible()
      await tilePage.getByTestId("rfqTimer").waitFor({
        state: "hidden",
        timeout: SPOT_TILE_RFQ_TIMEOUT,
      })
      const requoteBtn = tilePage.getByText(/Requote/)
      await expect(requoteBtn).toBeVisible({
        timeout: SPOT_RFQ_REQUOTE_TIMEOUT,
      })
    })
  })

  test.describe("Notional value", () => {
    test.beforeAll(async () => {
      await tilePage.getByTestId("tab-bar-tabs").getByText("EUR").click()
    })

    test("When I type 1k as notional value to EUR/USD then notional value should be 1 thousand", async () => {
      const spotTileNotionalInput = tilePage.locator(
        "input[id='notional-input-EURUSD']",
      )
      await spotTileNotionalInput.clear()
      await spotTileNotionalInput.pressSequentially("1k")

      await expect(spotTileNotionalInput).toHaveValue("1,000")
    })

    test("When I type 1m as notional value to EUR/USD then notional value should be 1 million", async () => {
      const spotTileNotionalInput = tilePage.locator(
        "input[id='notional-input-EURUSD']",
      )
      await spotTileNotionalInput.clear()
      await spotTileNotionalInput.pressSequentially("1m")

      await expect(spotTileNotionalInput).toHaveValue("1,000,000")
    })

    test("When I enter a number too large (over 1,000,000,000) then an error will appear 'Max exceeded'", async () => {
      const spotTileNotionalInput = tilePage.locator(
        "input[id='notional-input-EURUSD']",
      )
      await spotTileNotionalInput.clear()
      await spotTileNotionalInput.pressSequentially("1200000000")
      await expect(tilePage.getByText(/Max exceeded/)).toBeVisible()

      await spotTileNotionalInput.selectText()
      await spotTileNotionalInput.pressSequentially("1m")
      await expect(tilePage.getByText(/Max exceeded/)).toBeHidden()
    })
  })

  test.describe("Toggle between prices and graph views", () => {
    test("When I click the graph icon on the Live Rates bar then I should toggle from graph to price views", async () => {
      const toggle = tilePage.locator("[data-testid='action-toggleTileView']")

      // first click, goes into normal mode, should be no graphs
      await toggle.click()
      const tileState = await tilePage.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      expect(tileState).toBe("Normal")
      await expect(
        tilePage.locator("[data-testid='tile-graph']").nth(0),
      ).toBeHidden()

      // click toggleButton again, now expect there to be graphs
      await toggle.click()
      const tileState2 = await tilePage.evaluate(() =>
        window.localStorage.getItem("selectedView"),
      )
      expect(tileState2).toBe("Chart")
      await expect(
        tilePage.locator("[data-testid='tile-graph']").nth(0),
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
        await tilePage.getByTestId("tab-bar-tabs").getByText(currency).click()
        const totalTiles = await tilePage
          .locator('div[aria-label="Lives Rates Tiles"] > div')
          .count()

        expect(totalTiles).toBe(numTiles)
      })
    })
  })
})
