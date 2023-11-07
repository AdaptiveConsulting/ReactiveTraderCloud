/* eslint-disable no-empty-pattern */
import { BlotterColumnValue } from "../components/Blotter.component"
import { CurrencyPair, Side } from "../components/SpotTile.component"
import { expect, test } from "../pageFixture"
import FxPage from "../pages/fx.page"
import { Filter } from "../pages/fx.page"

test.describe("FX purchase", () => {
  let page: FxPage
  test.beforeAll(async ({ fxPage }) => {
    page = fxPage
    await page.open()
  })
  test.describe("Valid Purchase", () => {
    test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const eurusdTile = page.spotTileComponent.getTile(CurrencyPair.EURUSD)

      await eurusdTile.clearTextField()
      await eurusdTile.fillTextField("1m")
      await eurusdTile.selectSide(Side.SELL)

      await expect(eurusdTile.confirmationDialogGreen).toBeVisible()
      const tileTradeId = await eurusdTile.getTradeId()

      const firstRow = await page.blotterComponent.getTradeEntry(1)
      const blotterTradeId = await firstRow.getValueByColumn(
        BlotterColumnValue.TRADEID,
      )

      expect(tileTradeId).toBe(blotterTradeId)
    })

    test("When I buy USD/JPY then a tile displays in green with confirmation message", async ({}) => {
      await page.open()
      await page.selectCurrencyFilter(Filter.ALL)
      const usdjpyTile = page.spotTileComponent.getTile(CurrencyPair.USDJPY)

      await usdjpyTile.selectSide(Side.BUY)

      await expect(usdjpyTile.confirmationDialogGreen).toBeVisible()
    })
  })

  test.describe("Rejected purchase confirmation", () => {
    test("When I buy GBP/JPY then a tile displays in red with message 'Trade was rejected'", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const gbpjpyTile = page.spotTileComponent.getTile(CurrencyPair.GBPJPY)

      await gbpjpyTile.clearTextField()
      await gbpjpyTile.fillTextField("1m")
      await gbpjpyTile.selectSide(Side.BUY)

      await expect(gbpjpyTile.confirmationDialogRed).toBeVisible()
      const tileTradeId = await gbpjpyTile.getTradeId()

      const firstRow = await page.blotterComponent.getTradeEntry(1)
      const blotterTradeId = await firstRow.getValueByColumn(
        BlotterColumnValue.TRADEID,
      )

      expect(tileTradeId).toBe(blotterTradeId)
    })
  })

  test.describe("Timed out transaction", () => {
    test("When I sell EUR/JPY then an execution animation appears until a timed out tile displays in orange with message 'Trade taking longer than expected'", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const eurjpyTile = page.spotTileComponent.getTile(CurrencyPair.EURJPY)

      await eurjpyTile.clearTextField()
      await eurjpyTile.fillTextField("1m")
      await eurjpyTile.selectSide(Side.SELL)

      await expect(eurjpyTile.confirmationDialogOrange).toBeVisible()
      await expect(eurjpyTile.confirmationDialogGreen).toBeVisible()
      const tileTradeId = await eurjpyTile.getTradeId()

      const firstRow = await page.blotterComponent.getTradeEntry(1)
      const blotterTradeId = await firstRow.getValueByColumn(
        BlotterColumnValue.TRADEID,
      )

      expect(tileTradeId).toBe(blotterTradeId)
    })
  })

  test.describe("High notional RFQ", () => {
    test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const nzdusdTile = page.spotTileComponent.getTile(CurrencyPair.NZDUSD)

      await nzdusdTile.getRfqButton.click()
      await expect(nzdusdTile.rfqSellPrice).toContainText(/sell/, {
        ignoreCase: true,
      })
      await expect(nzdusdTile.rfqBuyPrice).toContainText(/buy/, {
        ignoreCase: true,
      })
      await nzdusdTile.getRfqButton.waitFor({ timeout: 10500 })
      await expect(nzdusdTile.getRfqButton).toContainText(/Requote/)
    })
  })

  test.describe("Notional value", () => {
    test("When I type 1k as notional value to EUR/USD then notional value should be 1,000", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const eurusdTile = page.spotTileComponent.getTile(CurrencyPair.EURUSD)

      await eurusdTile.clearTextField()
      await eurusdTile.fillTextField("1k")

      const notionalAmount = await eurusdTile.getTextField()

      expect(notionalAmount).toBe("1,000")
    })
    test("When I type 1m as notional value to EUR/USD then notional value should be 1,000,000", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const eurusdTile = page.spotTileComponent.getTile(CurrencyPair.EURUSD)

      await eurusdTile.clearTextField()
      await eurusdTile.fillTextField("1m")

      const notionalAmount = await eurusdTile.getTextField()

      expect(notionalAmount).toBe("1,000,000")
    })
    test("When I enter a number too large (over 1,000,000,000) then an error will appear 'Max exceeded'", async ({}) => {
      await page.selectCurrencyFilter(Filter.ALL)
      const eurusdTile = page.spotTileComponent.getTile(CurrencyPair.EURUSD)

      await eurusdTile.clearTextField()
      await eurusdTile.fillTextField("1200000000")
      await expect(eurusdTile.getMaxExceedError).toBeVisible()

      await eurusdTile.clearTextField()
      await eurusdTile.fillTextField("1k")
      await expect(eurusdTile.getMaxExceedError).not.toBeVisible()
    })
  })
})
