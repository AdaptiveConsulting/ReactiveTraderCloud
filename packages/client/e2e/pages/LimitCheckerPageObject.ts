import { Page, TestInfo } from "@playwright/test"

const TRADE_ID_COLUMN_INDEX = 1 // account for trade state (colour bar) column

export class LimitCheckerPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  get limitCheckerInput() {
    return this.page
      .locator("div", {
        has: this.page.locator("div", { hasText: /^EUR\/USD$/ }),
      })
      .last()
      .locator("input")
  }

  get firstTradeRow() {
    return this.page.locator(`[role="grid"] > div`).nth(1).locator("div")
  }

  get firstTradeIDCellContent() {
    return this.firstTradeRow.nth(TRADE_ID_COLUMN_INDEX).innerText()
  }
}
