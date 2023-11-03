import { BlotterColumnValue } from "../components/blotter.component"
import { CurrencyPair, Side } from "../components/spotTile.component"
import { expect, test } from "../pageFixture"
import { Filter } from "../pages/fx.page"

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
    fxPage.open()
    await fxPage.selectCurrencyFilter(Filter.ALL)
    const usdjpyTile = fxPage.spotTileComponent.getTile(CurrencyPair.USDJPY)

    await usdjpyTile.selectSide(Side.BUY)

    await expect(usdjpyTile.confirmationDialogGreen).toBeVisible()
  })
})
