import { expect, Page } from "@playwright/test"
import { test } from "./fixtures"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

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
    await firstRow.hover()
    // the background color here is hardcoded, change if it is not best practice
    await expect(firstRow).toHaveCSS("background-color", "rgb(83, 87, 96)")
  })
  test("when user buys a currency, the new row should flash briefly", async () => {
    const tile = await tilePage.locator('[data-testid="Buy-EURUSD"]').nth(0)
    await tile.click()

    const newRow = await blotterPage.locator('[role="grid"] > tr').nth(0)
    await expect(newRow).toHaveCSS(
      "animation",
      "1s ease-in-out 0s 3 normal none running erGPjB",
    )
  })
  test("when user clicks on the header of any column, it should sort it (depending on number of clicks, can be ascending or descending)", async () => {
    const firstTradeID = await blotterPage
      .locator('[role="grid"] > tr > td')
      .nth(1)
      .textContent()

    const sortTradeID = await blotterPage
      .locator("thead > tr > th > div")
      .nth(0)

    // filter once (descending)
    await sortTradeID.click()
    const afterClick1 = await blotterPage
      .locator('[role="grid"] > tr > td')
      .nth(1)
      .textContent()

    // filter 2nd time (ascending)
    await sortTradeID.click()
    const afterClick2 = await blotterPage
      .locator('[role="grid"] > tr > td')
      .nth(1)
      .textContent()

    expect(afterClick1).toBe(firstTradeID)
    expect(afterClick2).toBe("1")
  })
  test("when user enters column values into column search filter, it should return only rows with those values", async () => {
    const tradeIDColHeader = await blotterPage
      .locator("table > thead > tr > th")
      .nth(1)
    await tradeIDColHeader.hover()
    const filterButton = await blotterPage.locator(
      '[aria-label*="Open Trade ID"]',
    )
    await filterButton.click()
    const searchInput = await blotterPage.locator(
      '[aria-label*="Primary filter"]',
    )
    await searchInput.type("1", { delay: 100 })
    const searchedTradeID = await blotterPage
      .locator('[role="grid"] > tr > td')
      .nth(1)
      .textContent()
    await expect(searchedTradeID).toBe("1")
    // cleanup so the next test that runs is not filtered
    await searchInput.fill("")
  })
  test("when user clicks export button on blotter, should download a csv, and the csv data should match blotter data", async () => {
    const firstTradeID = await blotterPage
      .locator('[role="grid"] > tr > td')
      .nth(1)
      .textContent()
    const downloadPromise = blotterPage.waitForEvent("download")
    const downloadButton = await blotterPage.locator(
      '[aria-label="Export to CSV"]',
    )
    await downloadButton.click()
    const download = await downloadPromise
    await download.saveAs("e2e/test-data/blotter-data.csv")
    //read the downloaded file, use readFileSync because it is synchronous
    let csvData: Array<string> | string
    try {
      const data = fs
        .readFileSync("e2e/test-data/blotter-data.csv", "utf8")
        .toString()
        .split("\n") as Array<string>
      csvData = data
    } catch (err) {
      csvData = "error"
    }
    expect(typeof csvData).not.toBe("string")
    expect(csvData[1].split(",")[0]).toBe(firstTradeID)
  })
  test("when user filters blotter and then clicks export button on blotter, the csv file should be filtered", async () => {
    const tradeIDColHeader = await blotterPage
      .locator("table > thead > tr > th")
      .nth(1)
    await tradeIDColHeader.hover()
    const filterButton = await blotterPage.locator(
      '[aria-label*="Open Trade ID"]',
    )
    await filterButton.click()
    const searchInput = await blotterPage.locator(
      '[aria-label*="Primary filter"]',
    )
    await searchInput.type("1", { delay: 100 })

    const downloadPromise = blotterPage.waitForEvent("download")
    const downloadButton = await blotterPage.locator(
      '[aria-label="Export to CSV"]',
    )
    await downloadButton.click()
    const download = await downloadPromise
    await download.saveAs("e2e/test-data/filtered-data.csv")
    //read the downloaded file, use readFileSync because it is synchronous
    let filteredData: Array<string> | string
    try {
      const data = fs
        .readFileSync("e2e/test-data/filtered-data.csv", "utf8")
        .toString()
        .split("\n") as Array<string>
      filteredData = data
    } catch (err) {
      filteredData = "error"
    }
    await expect(typeof filteredData).not.toBe("string")
    await expect(filteredData[1].split(",")[0]).toBe("1")
  })
})
