/* eslint-disable no-empty-pattern */
import { BlotterColumnValue } from "../components/blotter.component"
import { CurrencyPair, Side } from "../components/spotTile.component"
import { expect, test } from "../pageFixture"
import FxPage from "../pages/fx.page"

test.describe("Blotter", () => {
  let page: FxPage
  test.beforeAll(async ({ fxPage }) => {
    page = fxPage
    await page.open()
  })
  test("When user hovers over a row on the Blotter, it should highlight that row", async ({}) => {
    const firstEntry = await page.blotterComponent.getTradeEntry(1)
    const color = firstEntry.backgroundColor

    await firstEntry.hover()
    const firstEntryHover = await page.blotterComponent.getTradeEntry(1)
    const colorHover = firstEntryHover.backgroundColor

    expect(color).not.toBe(colorHover)
  })

  test("when user buys a currency, the new row should flash briefly ", async ({}) => {
    const eurusdTile = page.spotTileComponent.getTile(CurrencyPair.EURUSD)

    await eurusdTile.clearTextField()
    await eurusdTile.fillTextField("1m")
    await eurusdTile.selectSide(Side.BUY)

    await expect(async () => {
      const firstEntry = await page.blotterComponent.getTradeEntry(1)
      expect(firstEntry.animation).toMatch(/1s ease-in-out/)
    }).toPass({ timeout: 5000 })
  })
  test("when user clicks on the header of any column, it should sort it (depending on number of clicks, can be ascending or descending)", async ({
    fxPage,
  }) => {
    const firstRow = await page.blotterComponent.getTradeEntry(1)
    const initialTradeID = await firstRow.getValueByColumn(
      BlotterColumnValue.TRADEID,
    )

    // filter once (descending)
    await page.blotterComponent.clickHeaderColumn(BlotterColumnValue.TRADEID)
    const firstClickTradeId = await firstRow.getValueByColumn(
      BlotterColumnValue.TRADEID,
    )
    expect(firstClickTradeId).toBe(initialTradeID)

    // filter 2nd time (ascending)
    await page.blotterComponent.clickHeaderColumn(BlotterColumnValue.TRADEID)
    const secondClickTradeId = await firstRow.getValueByColumn(
      BlotterColumnValue.TRADEID,
    )
    expect(secondClickTradeId).toBe("1")

    //reset column
    await page.blotterComponent.clickHeaderColumn(BlotterColumnValue.TRADEID)
  })

  test("when user enters column values into column search filter, it should return only rows with those values", async ({}) => {
    await page.blotterComponent.filterColumnByText(
      BlotterColumnValue.TRADEID,
      "1",
    )
    expect(await page.blotterComponent.getTradeCount()).toBe(1)

    const currentTradeEntry = await page.blotterComponent.getTradeEntry(1)
    expect(
      await currentTradeEntry.getValueByColumn(BlotterColumnValue.TRADEID),
    ).toBe("1")

    await page.blotterComponent.clearFilterColumn(
      BlotterColumnValue.TRADEID,
      true,
    )
    expect(await page.blotterComponent.getTradeCount()).toBeGreaterThan(1)
  })

  test("when user clicks export button on blotter, should download a csv, and the csv data should match blotter data", async ({}) => {
    const firstRowTradeID = await (
      await page.blotterComponent.getTradeEntry(1)
    ).getValueByColumn(BlotterColumnValue.TRADEID)

    const downloadPromise = page.waitForEventDownload()
    await page.blotterComponent.clickDownload()
    const download = await downloadPromise

    await download.saveAs("playwright/test-data/blotter-data.csv")
    //read the downloaded file, use readFileSync because it is synchronous
    const csvRows = page.blotterComponent.parseCSV(
      "playwright/test-data/blotter-data.csv",
    )

    expect(typeof csvRows).not.toBe("string")
    expect(page.blotterComponent.getTradeIDFromCSV(csvRows)).toBe(
      firstRowTradeID,
    )
  })

  test("when user filters blotter and then clicks export button on blotter, the csv file should be filtered", async ({}) => {
    await page.blotterComponent.filterColumnByText(
      BlotterColumnValue.TRADEID,
      "1",
    )

    const downloadPromise = page.waitForEventDownload()
    await page.blotterComponent.clickDownload()
    const download = await downloadPromise

    await download.saveAs("playwright/test-data/filtered-data.csv")

    //read the downloaded file, use readFileSync because it is synchronous
    const filteredCSVRows = page.blotterComponent.parseCSV(
      "playwright/test-data/filtered-data.csv",
    )

    expect(typeof filteredCSVRows).not.toBe("string")
    expect(page.blotterComponent.getTradeIDFromCSV(filteredCSVRows)).toBe("1")
  })
})
