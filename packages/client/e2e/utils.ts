import { expect, Locator, WorkerInfo } from "@playwright/test"

export const isOpenFin = (workerInfo: WorkerInfo) =>
  workerInfo.project.name === "openfin"

export const isResponsive = (workerInfo: WorkerInfo) => 
  workerInfo.project.name === "webResponsive"

export enum ExpectTimeout {
  MEDIUM = 15000,
  LONG = 30000,
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
  await expect(row.nth(cellIndex)).toHaveText(assertion)
}
