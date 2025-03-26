import { expect, Locator } from "@playwright/test"

import { test } from "./fixtures"
import { isOpenFin } from "./utils"

export const assertGridRow = async ({
  row,
  assertions,
  firstCellToAssert,
  lastCellToAssert,
}: {
  row: Locator
  assertions: string[]
  firstCellToAssert?: number
  lastCellToAssert?: number
}) => {
  let j = 0
  for (
    let i = firstCellToAssert ? firstCellToAssert : 0;
    i < (lastCellToAssert ? lastCellToAssert : assertions.length);
    i++
  ) {
    await expect(row.nth(i)).toHaveText(assertions[j])
    j++
  }
}

test.describe("Limit Checker", () => {
  test.beforeAll(async ({}, workerInfo) => {
    test.fixme(!isOpenFin(workerInfo), "Openfin Only")
  })

  test("Trade is checked and allowed if notional is under set limit", async ({
    limitCheckerPage,
    fxPages: { tilePO, blotterPO },
  }) => {
    const limitTableFirstRowCells = limitCheckerPage
      .locator(`[role="grid"] > div`)
      .nth(1)
      .locator("div")

    const limitCheckInput = limitCheckerPage
      .locator("div", {
        has: limitCheckerPage.locator("div", { hasText: /^EUR\/USD$/ }),
      })
      .last()
      .locator("input")

    const lastTradeIdString = await blotterPO.firstTradeRow.nth(1).innerText()
    const lastTradeId = Number(lastTradeIdString)

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()
    const limitId = Number(limitIdString)

    await limitCheckInput.fill("2000000")

    await tilePO.selectFilter("EUR")
    await tilePO.notionalInput("EURUSD").fill("1999999")
    await tilePO.buy("EURUSD")

    await expect(
      blotterPO.firstTradeRow
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
      row: blotterPO.firstTradeRow,
      assertions: ["Buy", "EURUSD", "EUR", "1,999,999"],
      firstCellToAssert: 4,
      lastCellToAssert: 8,
    })
  })

  test("Trade is blocked if notional is above limit", async ({
    limitCheckerPage,
    fxPages: { tilePO, blotterPO },
  }) => {
    const limitTableFirstRowCells = limitCheckerPage
      .locator(`[role="grid"] > div`)
      .nth(1)
      .locator("div")

    const tradeId = await blotterPO.firstTradeRow.nth(1).innerText()

    const limitCheckInput = limitCheckerPage
      .locator("div", {
        has: limitCheckerPage.locator("div", { hasText: /^EUR\/USD$/ }),
      })
      .last()
      .locator("input")

    const limitIdString = await limitTableFirstRowCells.nth(1).innerText()
    const limitId = Number(limitIdString)

    await limitCheckInput.fill("1000000")

    await tilePO.selectFilter("EUR")
    await tilePO.notionalInput("EURUSD").fill("1000001")
    await tilePO.buy("EURUSD")

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

    await expect(blotterPO.firstTradeRow.nth(1)).toHaveText(tradeId)
  })
})
