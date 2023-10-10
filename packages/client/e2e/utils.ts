import { expect, Locator, WorkerInfo } from "@playwright/test"

export const isOpenFin = (workerInfo: WorkerInfo) =>
  workerInfo.project.name === "openfin"

export enum ElementTimeout {
  AGGRESSIVE = 5000,
  NORMAL = 15000,
  LONG = 30000,
  RFQTIMEOUT = 10500,
}
export enum TestTimeout {
  NORMAL = 60000,
  EXTENDED = 90000,
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
