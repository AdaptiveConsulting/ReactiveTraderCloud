import { expect } from "@playwright/test"
import fs from "fs"

import { test } from "./fixtures"

const FIRST_TRADE_ROW_INDEX = 1 // account for header row

const getTradeIDFromCSV = (csvRows: string | string[]): string => {
  const firstRowFields = csvRows[FIRST_TRADE_ROW_INDEX].split(",")
  const tradeField = firstRowFields[0]
  return tradeField
}

test.describe("Trade Blotter", () => {
  test.afterAll(async ({ fxPages: { blotterPO } }) => {
    await blotterPO.clearFilters()
  })

  test("When user hovers over a row on the Blotter, it should highlight that row", async ({
    fxPages: { blotterPO },
  }) => {
    const firstRow = blotterPO.page.locator(`[role="grid"] > div`).nth(1)
    const color = await firstRow.evaluate((element) => {
      return window
        .getComputedStyle(element)
        .getPropertyValue("background-color")
    })
    await firstRow.hover()
    await expect(firstRow).not.toHaveCSS("background-color", color)
  })

  test("when user buys a currency, the new row should flash briefly", async ({
    fxPages: { tilePO, blotterPO },
  }) => {
    await tilePO.selectFilter("EUR")
    await tilePO.notionalInput("EURUSD").clear()
    await tilePO.notionalInput("EURUSD").pressSequentially("1m")

    // circumvent low occurences of false negative. if it fails on 1st attempt then we retry until timeout
    await expect(async () => {
      await tilePO.notionalInput("EURUSD").clear()
      await tilePO.notionalInput("EURUSD").pressSequentially("1m")
      await tilePO.buy("EURUSD")

      const tradeID = await tilePO.tradeId.innerText()

      const newRow = blotterPO.page.getByTestId(`trades-grid-row-${tradeID}`)

      await expect(newRow).toHaveCSS("animation", /1s ease-in-out/)
    }, `Trade then test blotter flash`).toPass()
  })

  test("when user clicks on the header of any column, it should sort it (depending on number of clicks, can be ascending or descending)", async ({
    fxPages: { blotterPO },
  }) => {
    const firstRowTradeID = await blotterPO.firstTradeIDCellContent

    // filter once (descending)
    await blotterPO.tradeIDColHeader.click()
    const afterClick1 = await blotterPO.firstTradeIDCellContent

    expect(afterClick1).toBe(firstRowTradeID)

    // filter 2nd time (ascending)
    await blotterPO.tradeIDColHeader.click()
    const afterClick2 = await blotterPO.firstTradeIDCellContent

    expect(afterClick2).toBe("1")

    //reset column
    await blotterPO.tradeIDColHeader.click()
  })

  test("when user enters column values into column search filter, it should return only rows with those values", async ({
    fxPages: { blotterPO },
  }) => {
    await blotterPO.tradeIDColHeader.hover()
    const filterButton = blotterPO.tradeFilterButton

    await filterButton.click()
    const searchInput = blotterPO.primaryFilter

    const tradeIDToSearch = "1"
    await searchInput.pressSequentially(tradeIDToSearch, { delay: 100 })
    const rows = blotterPO.page.locator(`[role="grid"] > div`)
    expect(await rows.count()).toBe(2)
    const firstRowTradeID = await blotterPO.firstTradeIDCellContent
    expect(firstRowTradeID).toBe(tradeIDToSearch)
    // cleanup so the next test that runs is not filtered
    await searchInput.fill("")
  })

  test("when user clicks export button on blotter, should download a csv, and the csv data should match blotter data", async ({
    fxPages: { blotterPO },
  }) => {
    const firstRowTradeID = await blotterPO.firstTradeIDCellContent
    const downloadPromise = blotterPO.page.waitForEvent("download")
    const downloadButton = blotterPO.exportToCsvButton
    await downloadButton.click()
    const download = await downloadPromise
    await download.saveAs("e2e/test-data/blotter-data.csv")
    let csvRows: Array<string> | string
    try {
      csvRows = fs
        .readFileSync("e2e/test-data/blotter-data.csv", "utf8")
        .toString()
        .split("\n") as Array<string>
    } catch {
      csvRows = "error"
    }
    expect(typeof csvRows).not.toBe("string")
    expect(getTradeIDFromCSV(csvRows)).toBe(firstRowTradeID)
  })

  test("when user filters blotter and then clicks export button on blotter, the csv file should be filtered", async ({
    fxPages: { blotterPO },
  }) => {
    await blotterPO.tradeIDColHeader.hover()

    const filterButton = blotterPO.tradeFilterButton

    await filterButton.click()

    const searchInput = blotterPO.primaryFilter

    const tradeIDToSearch = "1"
    await searchInput.pressSequentially(tradeIDToSearch, { delay: 100 })

    const downloadPromise = blotterPO.page.waitForEvent("download")

    const downloadButton = blotterPO.page.locator(
      '[aria-label="Export to CSV"]',
    )
    await downloadButton.click()

    const download = await downloadPromise

    await download.saveAs("e2e/test-data/filtered-data.csv")

    let filteredCSVRows: Array<string> | string
    try {
      filteredCSVRows = fs
        .readFileSync("e2e/test-data/filtered-data.csv", "utf8")
        .toString()
        .split("\n") as Array<string>
    } catch {
      filteredCSVRows = "error"
    }

    expect(typeof filteredCSVRows).not.toBe("string")
    expect(getTradeIDFromCSV(filteredCSVRows)).toBe(tradeIDToSearch)
  })
})
