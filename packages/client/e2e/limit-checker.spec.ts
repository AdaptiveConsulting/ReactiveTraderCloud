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
  for (
    let i = firstCellToAssert ? firstCellToAssert : 0, j = 0;
    i < (lastCellToAssert ? lastCellToAssert : assertions.length);
    i++, j++
  ) {
    await expect(row.nth(i)).toHaveText(assertions[j])
  }
}

test.describe("Limit Checker", () => {
  test.beforeAll(async ({}, workerInfo) => {
    test.fixme(!isOpenFin(workerInfo), "Openfin Only")
  })

  test("Trade is checked and allowed if notional is under set limit", async ({
    limitCheckerPO,
    fxPages: { tilePO, blotterPO },
  }) => {
    const fxBlotterLastTradeId = Number(await blotterPO.firstTradeIDCellContent)

    const limitCheckerTradeId = Number(
      await limitCheckerPO.firstTradeIDCellContent,
    )

    await limitCheckerPO.limitCheckerInput.fill("2000000")

    await tilePO.selectFilter("EUR")
    await tilePO.notionalInput("EURUSD").fill("1999999")
    await tilePO.buy("EURUSD")

    await expect(
      blotterPO.firstTradeRow
        .nth(1)
        .getByText(
          String(isNaN(fxBlotterLastTradeId) ? 1 : fxBlotterLastTradeId + 1),
        ),
    ).toBeVisible()

    await assertGridRow({
      row: limitCheckerPO.firstTradeRow,
      assertions: [
        String(isNaN(limitCheckerTradeId) ? 0 : limitCheckerTradeId + 1),
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
    limitCheckerPO,
    fxPages: { tilePO, blotterPO },
  }) => {
    const fxBlotterLastTradeId = await blotterPO.firstTradeIDCellContent

    const limitCheckerTradeId = Number(
      await limitCheckerPO.firstTradeIDCellContent,
    )

    await limitCheckerPO.limitCheckerInput.fill("1000000")

    await tilePO.selectFilter("EUR")
    await tilePO.notionalInput("EURUSD").fill("1000001")
    await tilePO.buy("EURUSD")

    await assertGridRow({
      row: limitCheckerPO.firstTradeRow,
      assertions: [
        String(isNaN(limitCheckerTradeId) ? 0 : limitCheckerTradeId + 1),
        "Failure",
        "EURUSD",
        "1,000,001",
        "1,000,000",
      ],
      firstCellToAssert: 1,
      lastCellToAssert: 6,
    })

    expect(await blotterPO.firstTradeIDCellContent).toBe(fxBlotterLastTradeId)
  })
})
