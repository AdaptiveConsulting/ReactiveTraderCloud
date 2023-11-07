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
          expect(eurusdTile.confirmationDialogGreen).toContainText(/You/)
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
    expect(usdjpyTile.confirmationDialogGreen).toContainText(/You/)
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
        const tileTradeId = await eurjpyTile.getTradeId()
        
        await expect(eurjpyTile.confirmationDialogGreen).toBeVisible()
              //TODO we could try to add this You verification to the Component function
              expect(eurjpyTile.confirmationDialogGreen).toContainText(/You/)
        const greenTileTradeId = await eurjpyTile.getTradeId()
        
        expect(tileTradeId).toBe(greenTileTradeId)

        const blotterTradeId = await fxPage.blotterComponent
            .getTradeLine(tileTradeId)
            .getValueByColumn(BlotterColumnValue.TRADEID)

        expect(tileTradeId).toBe(blotterTradeId)
    })
})
