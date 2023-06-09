import { Page } from "playwright"

import { test } from "./fixtures"
import { assertGridCell, assertGridRow, OPENFIN_PROJECT_NAME } from "./utils"

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

    const limitCheckInput = limitCheckerPage.getByLabel("EUR/USD")

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()

    const limitId = Number(limitIdString) ? Number(limitIdString) : -1

    await limitCheckInput.fill("1000000")

    const tileInput = tilePage.getByLabel("EUR").nth(0)
    await tileInput.fill("12345")

    await tilePage.locator("[data-testid='Buy-EURUSD']").click()

    await assertGridRow(
      limitTableFirstRowCells,
      [limitId + 1 + "", "Success", "EURUSD", "12,345"],
      1,
      5,
    )

    await assertGridCell(tradeBlotterFirstRowCells, 2, "Done")

    await assertGridRow(
      tradeBlotterFirstRowCells,
      ["Buy", "EURUSD", "EUR", "12,345"],
      4,
      8,
    )
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

    const limitCheckInput = limitCheckerPage.getByLabel("EUR/USD")
    const tileInput = tilePage.getByLabel("EUR").nth(0)

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()
    const limitId = Number(limitIdString) ? Number(limitIdString) : -1

    await limitCheckInput.fill("1000")

    await tileInput.fill("100000")

    await tilePage.locator("[data-testid='Buy-EURUSD']").click()

    await assertGridRow(
      limitTableFirstRowCells,
      [limitId + 2 + "", "Failure", "EURUSD", "100,000"],
      1,
      5,
    )

    await assertGridCell(tradeBlotterFirstRowCells, 1, tradeId)
  })
})
