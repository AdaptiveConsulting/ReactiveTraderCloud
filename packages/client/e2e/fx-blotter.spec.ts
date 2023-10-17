import { expect, Page } from "@playwright/test"
// import { fxColDef, fxColFields } from "../src/App/Trades/TradesState/colConfig"
// import { FxTrade } from "../src/services/trades"
import fs from "fs"

import { test } from "./fixtures"
import { ElementTimeout, isOpenFin } from "./utils"

const getTradeIDColIndex = () => {
  // const tradeIndex = fxColFields.indexOf(
  //   fxColDef.tradeId as unknown as keyof FxTrade,
  // )
  // // + 1 to account for status indicator
  // return tradeIndex + 1
  return 1
}

const getTradeIDCellContent = (
  page: Page,
  rowIndex: number,
): Promise<string | null> => {
  return page
    .locator('[role="grid"] > div')
    .nth(rowIndex)
    .locator("div")
    .nth(getTradeIDColIndex())
    .textContent()
}

const getTradeIDFromCSV = (csvRows: string | string[]): string => {
  // get index 1 to account for header row
  const firstRowFields = csvRows[1].split(",")
  const tradeField = firstRowFields[0]
  return tradeField
}

test.describe("Trade Blotter", () => {
  let tilePage: Page
  let blotterPage: Page

  test.beforeAll(async ({ context, fxPagesRec }, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      tilePage = fxPagesRec["fx-tiles"]
      blotterPage = fxPagesRec["fx-blotter"]
    } else {
      const pages = context.pages()
      const mainWindow = pages.length > 0 ? pages[0] : await context.newPage()

      await mainWindow.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)

      tilePage = mainWindow
      blotterPage = mainWindow
    }
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({}, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      await blotterPage.getByTestId("filter-button").click()
    }
  })

  test("When user hovers over a row on the Blotter, it should highlight that row", async () => {
    const firstRow = blotterPage.locator(`[role="grid"] > div`).nth(1)
    const color = await firstRow.evaluate((element) => {
      return window
        .getComputedStyle(element)
        .getPropertyValue("background-color")
    })
    await firstRow.hover()
    await expect(firstRow).not.toHaveCSS("background-color", color)
  })

  test("when user buys a currency, the new row should flash briefly ", async () => {
    await tilePage.locator("input[id='notional-input-EURUSD']").clear()
    await tilePage
      .locator("input[id='notional-input-EURUSD']")
      .pressSequentially("1m")

    // circumvent low occurences of false negative. if it fails on 1st attempt then we retry until timeout
    const retryTimeout = ElementTimeout.NORMAL
    await expect(async () => {
      await tilePage.locator("input[id='notional-input-EURUSD']").clear()
      await tilePage
        .locator("input[id='notional-input-EURUSD']")
        .pressSequentially("1m")
      await tilePage.locator('[data-testid="Buy-EURUSD"]').nth(0).click()

      const tradeID = await tilePage
        .locator("[data-testid='trade-id']")
        .innerText()

      const newRow = blotterPage.getByTestId(`trades-grid-row-${tradeID}`)

      await expect(newRow).toHaveCSS("animation", /1s ease-in-out/, {
        timeout: ElementTimeout.AGGRESSIVE,
      })
    }, `Unable to retry clicking on accept button within ${retryTimeout} seconds`).toPass(
      {
        timeout: retryTimeout,
      },
    )
  })

  test("when user clicks on the header of any column, it should sort it (depending on number of clicks, can be ascending or descending)", async () => {
    const firstRowTradeID = await getTradeIDCellContent(blotterPage, 1)

    const tradeIDColHeader = blotterPage.getByText("Trade ID", {
      exact: true,
    })

    // filter once (descending)
    await tradeIDColHeader.click()
    const afterClick1 = await getTradeIDCellContent(blotterPage, 1)

    expect(afterClick1).toBe(firstRowTradeID)

    // filter 2nd time (ascending)
    await tradeIDColHeader.click()
    const afterClick2 = await getTradeIDCellContent(blotterPage, 1)

    expect(afterClick2).toBe("1")

    //reset column
    await tradeIDColHeader.click()
  })

  test("when user enters column values into column search filter, it should return only rows with those values", async () => {
    const tradeIDColHeader = blotterPage.getByText("Trade ID", {
      exact: true,
    })
    await tradeIDColHeader.hover()
    const filterButton = blotterPage.locator('[aria-label*="Open Trade ID"]')
    await filterButton.click()
    const searchInput = blotterPage.locator('[aria-label*="Primary filter"]')
    const tradeIDToSearch = "1"
    await searchInput.pressSequentially(tradeIDToSearch, { delay: 100 })
    const rows = blotterPage.locator(`[role="grid"] > div`)
    expect(await rows.count()).toBe(2)
    const firstRowTradeID = await getTradeIDCellContent(blotterPage, 1)
    expect(firstRowTradeID).toBe(tradeIDToSearch)
    // cleanup so the next test that runs is not filtered
    await searchInput.fill("")
  })

  test("when user clicks export button on blotter, should download a csv, and the csv data should match blotter data", async () => {
    const firstRowTradeID = await getTradeIDCellContent(blotterPage, 1)
    const downloadPromise = blotterPage.waitForEvent("download")
    const downloadButton = blotterPage.locator('[aria-label="Export to CSV"]')
    await downloadButton.click()
    const download = await downloadPromise
    await download.saveAs("e2e/test-data/blotter-data.csv")
    //read the downloaded file, use readFileSync because it is synchronous
    let csvRows: Array<string> | string
    try {
      csvRows = fs
        .readFileSync("e2e/test-data/blotter-data.csv", "utf8")
        .toString()
        .split("\n") as Array<string>
    } catch (err) {
      csvRows = "error"
    }
    expect(typeof csvRows).not.toBe("string")
    expect(getTradeIDFromCSV(csvRows)).toBe(firstRowTradeID)
  })

  test("when user filters blotter and then clicks export button on blotter, the csv file should be filtered", async () => {
    const tradeIDColHeader = blotterPage.getByText("Trade ID", {
      exact: true,
    })

    await tradeIDColHeader.hover()

    const filterButton = blotterPage.locator('[aria-label*="Open Trade ID"]')

    await filterButton.click()

    const searchInput = blotterPage.locator('[aria-label*="Primary filter"]')

    const tradeIDToSearch = "1"
    await searchInput.pressSequentially(tradeIDToSearch, { delay: 100 })

    const downloadPromise = blotterPage.waitForEvent("download")

    const downloadButton = blotterPage.locator('[aria-label="Export to CSV"]')
    await downloadButton.click()

    const download = await downloadPromise

    await download.saveAs("e2e/test-data/filtered-data.csv")

    //read the downloaded file, use readFileSync because it is synchronous
    let filteredCSVRows: Array<string> | string
    try {
      filteredCSVRows = fs
        .readFileSync("e2e/test-data/filtered-data.csv", "utf8")
        .toString()
        .split("\n") as Array<string>
    } catch (err) {
      filteredCSVRows = "error"
    }

    expect(typeof filteredCSVRows).not.toBe("string")
    expect(getTradeIDFromCSV(filteredCSVRows)).toBe(tradeIDToSearch)
  })
})
