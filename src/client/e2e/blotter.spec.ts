import { expect, Page } from "@playwright/test"
import { test } from "./fixtures"
// import { fxColDef, fxColFields } from "../src/App/Trades/TradesState/colConfig"
// import { FxTrade } from "../src/services/trades"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

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
    .locator('[role="grid"] > tr')
    .nth(rowIndex)
    .locator("td")
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

  test.beforeAll(async ({ context, fxOpenfinPagesRec }, testInfo) => {
    if (testInfo.project.name === "openfin") {
      const mainWindow = fxOpenfinPagesRec["mainWindow"]
      await mainWindow.evaluate(async () => {
        const currentWindow = window.fin.desktop.Window.getCurrent()
        currentWindow.maximize()
        return window.fin
      })

      tilePage = fxOpenfinPagesRec["fx-tiles"]
      blotterPage = fxOpenfinPagesRec["fx-blotter"]
    } else {
      const pages = await context.pages()
      const mainWindow = pages.length > 0 ? pages[0] : await context.newPage()

      await mainWindow.goto(`${process.env.URL_PATH}`)

      tilePage = mainWindow
      blotterPage = mainWindow
    }
  })
  test("When user hovers over a row on the Blotter, it should highlight that row", async () => {
    const firstRow = await blotterPage.locator('[role="grid"] > tr').nth(0)
    const color = await firstRow.evaluate((element) =>
      window.getComputedStyle(element).getPropertyValue("background-color"),
    )
    await firstRow.hover()
    await expect(firstRow).not.toHaveCSS("background-color", color)
  })
  test("when user buys a currency, the new row should flash briefly", async () => {
    const tile = await tilePage.locator('[data-testid="Buy-EURUSD"]').nth(0)
    await tile.click()

    const tradeID = await tilePage
      .locator("[data-testid='trade-id']")
      .innerText()
    const newRow = await blotterPage.getByTestId(`trades-grid-row-${tradeID}`)
    await expect(newRow).toHaveCSS("animation", /1s ease-in-out/)
  })
  test("when user clicks on the header of any column, it should sort it (depending on number of clicks, can be ascending or descending)", async () => {
    const firstRowTradeID = await getTradeIDCellContent(blotterPage, 0)

    const tradeIDColHeader = await blotterPage.getByText("Trade ID", {
      exact: true,
    })

    // filter once (descending)
    await tradeIDColHeader.click()
    const afterClick1 = await getTradeIDCellContent(blotterPage, 0)

    expect(afterClick1).toBe(firstRowTradeID)

    // filter 2nd time (ascending)
    await tradeIDColHeader.click()
    const afterClick2 = await getTradeIDCellContent(blotterPage, 0)

    expect(afterClick2).toBe("1")
  })
  test("when user enters column values into column search filter, it should return only rows with those values", async () => {
    const tradeIDColHeader = await blotterPage.getByText("Trade ID", {
      exact: true,
    })
    await tradeIDColHeader.hover()
    const filterButton = await blotterPage.locator(
      '[aria-label*="Open Trade ID"]',
    )
    await filterButton.click()
    const searchInput = await blotterPage.locator(
      '[aria-label*="Primary filter"]',
    )
    const tradeIDToSearch = "1"
    await searchInput.type(tradeIDToSearch, { delay: 100 })
    const rows = await blotterPage.locator('[role="grid"] > tr')
    await expect(await rows.count()).toBe(1)
    const firstRowTradeID = await getTradeIDCellContent(blotterPage, 0)
    await expect(firstRowTradeID).toBe(tradeIDToSearch)
    // cleanup so the next test that runs is not filtered
    await searchInput.fill("")
  })
  test("when user clicks export button on blotter, should download a csv, and the csv data should match blotter data", async () => {
    const firstRowTradeID = await getTradeIDCellContent(blotterPage, 0)
    const downloadPromise = blotterPage.waitForEvent("download")
    const downloadButton = await blotterPage.locator(
      '[aria-label="Export to CSV"]',
    )
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
    const tradeIDColHeader = await blotterPage.getByText("Trade ID", {
      exact: true,
    })
    await tradeIDColHeader.hover()
    const filterButton = await blotterPage.locator(
      '[aria-label*="Open Trade ID"]',
    )
    await filterButton.click()
    const searchInput = await blotterPage.locator(
      '[aria-label*="Primary filter"]',
    )
    const tradeIDToSearch = "2"
    await searchInput.type(tradeIDToSearch, { delay: 100 })

    const downloadPromise = blotterPage.waitForEvent("download")
    const downloadButton = await blotterPage.locator(
      '[aria-label="Export to CSV"]',
    )
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
    await expect(typeof filteredCSVRows).not.toBe("string")
    await expect(getTradeIDFromCSV(filteredCSVRows)).toBe(tradeIDToSearch)
  })
})
