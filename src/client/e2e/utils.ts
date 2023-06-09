import { expect } from "@playwright/test"
import { Locator } from "playwright"

export const OPENFIN_PROJECT_NAME = "openfin"

export const assertGridRow = async (
  row: Locator,
  assertions: string[],
  startIndex?: number,
  endIndex?: number,
) => {
  let j = 0
  for (
    let i = startIndex ? startIndex : 0;
    i < (endIndex ? endIndex : assertions.length);
    i++
  ) {
    assertGridCell(row, i, assertions[j])
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
