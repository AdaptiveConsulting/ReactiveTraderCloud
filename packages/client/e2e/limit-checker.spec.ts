/* eslint-disable playwright/expect-expect */
import { expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { assertGridCell, assertGridRow, isOpenFin } from "./utils"

test.describe("Limit Checker", () => {
  let tilePage: Page
  let blotterPage: Page

  test.beforeAll(async ({ fxPages }, workerInfo) => {
    test.fixme(!isOpenFin(workerInfo), "Openfin Only")

    tilePage = fxPages["fx-tiles"]
    blotterPage = fxPages["fx-blotter"]
  })

  test("Trade is checked and allowed if notional is under set limit", async ({
    limitCheckerPage,
  }) => {
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
    const lastTradeId = Number(lastTradeIdString)

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()
    const limitId = Number(limitIdString)

    await limitCheckInput.fill("2000000")

    const tileInput = tilePage.getByLabel("EUR").nth(0)
    await tileInput.fill("1999999")

    await tilePage.locator("[data-testid='Buy-EURUSD']").click()

    await expect(
      tradeBlotterFirstRowCells
        .nth(1)
        .getByText(String(isNaN(lastTradeId) ? 1 : lastTradeId + 1)),
    ).toBeVisible()

    await assertGridRow({
      row: limitTableFirstRowCells,
      assertions: [
        String(isNaN(limitId) ? 0 : limitId + 1),
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

  test("Trade is blocked if notional is above limit", async ({
    limitCheckerPage,
  }) => {
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
    const limitId = Number(limitIdString)

    await limitCheckInput.fill("1000000")

    await tileInput.fill("1000001")

    await tilePage.locator("[data-testid='Buy-EURUSD']").click()

    await assertGridRow({
      row: limitTableFirstRowCells,
      assertions: [
        String(isNaN(limitId) ? 0 : limitId + 1),
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
