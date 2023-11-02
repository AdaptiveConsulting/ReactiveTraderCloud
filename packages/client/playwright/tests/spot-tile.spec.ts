import { BlotterColumnValue } from "../components/blotter.component"
import { CurrencyPair, Filter, Side } from "../components/spotTile.component"
import { expect, test } from "../pageFixture"

test.describe("Valid Purchase", () => {
  test("When I sell EUR to USD then trade Id shown in tile should match trade Id shown in blotter", async ({
    fxPage,
  }) => {
    const eurusdTile = fxPage.spotTileComponent.getSpotTile(CurrencyPair.EURUSD)
    await fxPage.open()
    await fxPage.spotTileComponent.selectFilter(Filter.ALL)

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1m")
    await eurusdTile.selectSide(Side.SELL)

    await expect(eurusdTile.confirmationDialogGreen).toBeVisible()
    const tradeId = await eurusdTile.getTradeId()

    const blotterTradeId = await fxPage.blotterComponent.getTradeLineValue(
      tradeId,
      BlotterColumnValue.TRADEID,
    )

    expect(tradeId).toBe(blotterTradeId)
  })

  test("When I buy USD/JPY then a tile displays in green with confirmation message", async ({
    fxPage,
  }) => {
    fxPage.open()
    const usdjpyTile = fxPage.spotTileComponent.getSpotTile(CurrencyPair.USDJPY)

    await fxPage.spotTileComponent.selectFilter(Filter.ALL)
    await usdjpyTile.selectSide(Side.BUY)

    await expect(usdjpyTile.confirmationDialogGreen).toBeVisible()
  })
})
