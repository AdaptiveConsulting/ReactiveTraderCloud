import { Page } from "playwright"

import { test } from "./fixtures"
import { assertGridCell, assertGridRow, OPENFIN_PROJECT_NAME, Timeout } from "./utils"

test.describe("Limit Checker", () => {
  let tilePage: Page
  let blotterPage: Page
  let limitCheckerPage: Page

  test.beforeAll(async ({ fxPagesRec, limitCheckerPageRec }, testInfo) => {
    if (testInfo.project.name === OPENFIN_PROJECT_NAME) {
      tilePage = fxPagesRec["fx-tiles"]
      blotterPage = fxPagesRec["fx-blotter"]
      limitCheckerPage = limitCheckerPageRec
    }
  })

  // eslint-disable-next-line no-empty-pattern
  test("Trade is checked and allowed if notional is under set limit", async ({}, testInfo) => {
    test.skip(testInfo.project.name !== OPENFIN_PROJECT_NAME, "Openfin Only")

    const limitTableFirstRowCells = limitCheckerPage
      .locator(`[role="grid"] > div`)
      .nth(1)
      .locator("div")

    const tradeBlotterFirstRowCells = blotterPage
      .locator("[role=grid] > div")
      .nth(1)
      .locator("div")

    const limitCheckInput = limitCheckerPage
      .locator("div", {
        has: limitCheckerPage.locator("div", { hasText: /^EUR\/USD$/ }),
      })
      .last()
      .locator("input")

    const lastTradeIdString = await tradeBlotterFirstRowCells.nth(1).innerText()
    const lastTradeId = isNaN(Number(lastTradeIdString))
      ? 0
      : Number(lastTradeIdString)

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()
    const limitId = isNaN(Number(limitIdString)) ? -1 : Number(limitIdString)

    await limitCheckInput.fill("2000000")

    const tileInput = tilePage.getByLabel("EUR").nth(0)
    await tileInput.fill("1999999")

    await tilePage.locator("[data-testid='Buy-EURUSD']").click()

    await tradeBlotterFirstRowCells
      .nth(1)
      .getByText(lastTradeId + 1 + "")
      .waitFor({ state: "visible", timeout: Timeout.AGGRESSIVE })

    await assertGridRow({
      row: limitTableFirstRowCells,
      assertions: [
        limitId + 1 + "",
        "Success",
        "EURUSD",
        "1,999,999",
        "2,000,000",
      ],
      firstCellToAssert: 1,
      lastCellToAssert: 6,
    })

    await assertGridRow({
      row: tradeBlotterFirstRowCells,
      assertions: ["Buy", "EURUSD", "EUR", "1,999,999"],
      firstCellToAssert: 4,
      lastCellToAssert: 8,
    })
  })

  test("Trade is blocked if notional is above limit", async ({}, testInfo) => {
    test.skip(testInfo.project.name !== OPENFIN_PROJECT_NAME, "Openfin Only")

    const limitTableFirstRowCells = limitCheckerPage
      .locator(`[role="grid"] > div`)
      .nth(1)
      .locator("div")

    const tradeBlotterFirstRowCells = blotterPage
      .locator("[role=grid] > div")
      .nth(1)
      .locator("div")

    const tradeId = await tradeBlotterFirstRowCells.nth(1).innerText()

    const limitCheckInput = limitCheckerPage
      .locator("div", {
        has: limitCheckerPage.locator("div", { hasText: /^EUR\/USD$/ }),
      })
      .last()
      .locator("input")

    const tileInput = tilePage.getByLabel("EUR").nth(0)

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()
    const limitId = !isNaN(Number(limitIdString)) ? Number(limitIdString) : -1

    await limitCheckInput.fill("1000000")

    await tileInput.fill("1000001")

    await tilePage.locator("[data-testid='Buy-EURUSD']").click()

    await assertGridRow({
      row: limitTableFirstRowCells,
      assertions: [
        limitId + 1 + "",
        "Failure",
        "EURUSD",
        "1,000,001",
        "1,000,000",
      ],
      firstCellToAssert: 1,
      lastCellToAssert: 6,
    })

    await assertGridCell(tradeBlotterFirstRowCells, 1, tradeId)
  })
})
