import { BlotterColumnValue } from "../components/blotter.component"
import { CurrencyPair, Side } from "../components/spotTile.component"
import { expect, test } from "../pageFixture"
import { Filter } from "../pages/fx.page"
import { Timeout } from "../../e2e/utils"

test.describe("Valid Purchase", () => {
  test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const eurusdTile = fxPage.spotTileComponent.getTile(CurrencyPair.EURUSD)

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1m")
    await eurusdTile.selectSide(Side.SELL)

    await expect(eurusdTile.confirmationDialogGreen).toBeVisible()
    const tileTradeId = await eurusdTile.getTradeId()

    const blotterTradeId = await fxPage.blotterComponent
      .getTradeLine(tileTradeId)
      .getValueByColumn(BlotterColumnValue.TRADEID)

    expect(tileTradeId).toBe(blotterTradeId)
  })

  test("When I buy USD/JPY then a tile displays in green with confirmation message", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const usdjpyTile = fxPage.spotTileComponent.getTile(CurrencyPair.USDJPY)

    await usdjpyTile.selectSide(Side.BUY)

    await expect(usdjpyTile.confirmationDialogGreen).toBeVisible()
  })
})

test.describe("Rejected purchase confirmation", () => {
  test("When I buy GBP/JPY then a tile displays in red with message 'Trade was rejected'", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const gbpjpyTile = fxPage.spotTileComponent.getTile(CurrencyPair.GBPJPY)

    await gbpjpyTile.clearTextField()
    await gbpjpyTile.fillTextField("1m")
    await gbpjpyTile.selectSide(Side.BUY)

    await expect(gbpjpyTile.confirmationDialogRed).toBeVisible()
    const tileTradeId = await gbpjpyTile.getTradeId()

    const blotterTradeId = await fxPage.blotterComponent
      .getTradeLine(tileTradeId)
      .getValueByColumn(BlotterColumnValue.TRADEID)

    expect(tileTradeId).toBe(blotterTradeId)
  })
})

test.describe("Timed out transaction", () => {
  test("When I sell EUR/JPY then an execution animation appears until a timed out tile displays in orange with message 'Trade taking longer than expected'", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const eurjpyTile = fxPage.spotTileComponent.getTile(CurrencyPair.EURJPY)

    await eurjpyTile.clearTextField()
    await eurjpyTile.fillTextField("1m")
    await eurjpyTile.selectSide(Side.SELL)

    await expect(eurjpyTile.confirmationDialogOrange).toBeVisible()
    await expect(eurjpyTile.confirmationDialogGreen).toBeVisible()
    const tileTradeId = await eurjpyTile.getTradeId()

    const blotterTradeId = await fxPage.blotterComponent
      .getTradeLine(tileTradeId)
      .getValueByColumn(BlotterColumnValue.TRADEID)

    expect(tileTradeId).toBe(blotterTradeId)
  })
})

test.describe("High notional RFQ", () => {
  test("When I initiate RFQ on NZD/USD then it should display fixed prices for buy/sell and after 10 secs, and a requote button appears", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const nzdusdTile = fxPage.spotTileComponent.getTile(CurrencyPair.NZDUSD)

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
  test("When I type 1k as notional value to EUR/USD then notional value should be 1,000", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const eurusdTile = fxPage.spotTileComponent.getTile(CurrencyPair.EURUSD)

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1k")

    const notionalAmount = await eurusdTile.getTextField()

    expect(notionalAmount).toBe("1,000")
  })
  test("When I type 1m as notional value to EUR/USD then notional value should be 1,000,000", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const eurusdTile = fxPage.spotTileComponent.getTile(CurrencyPair.EURUSD)

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1m")

    const notionalAmount = await eurusdTile.getTextField()

    expect(notionalAmount).toBe("1,000,000")
  })
  test("When I enter a number too large (over 1,000,000,000) then an error will appear 'Max exceeded'", async ({
    fxPage,
  }) => {
    await fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const eurusdTile = fxPage.spotTileComponent.getTile(CurrencyPair.EURUSD)

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1200000000")
    await expect(eurusdTile.getMaxExceedError).toBeVisible()

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1k")
    await expect(eurusdTile.getMaxExceedError).not.toBeVisible()
    

    
  })
})
