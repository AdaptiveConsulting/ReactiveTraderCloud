import { expect, Locator } from "@playwright/test"

export const OPENFIN_PROJECT_NAME = "openfin"
export enum Timeout {
  AGGRESSIVE = 5000,
  NORMAL = 10000,
  LONG = 20000,
}
export enum TestTimeout {
  NORMAL = 30000,
  EXTENDED = 60000
}

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
    await assertGridCell(row, i, assertions[j])
    j++
  }
}

export const assertGridCell = async (
  row: Locator,
  cellIndex: number,
  assertion: string,
) => {
  expect(await row.nth(cellIndex).innerText()).toBe(assertion)
}
