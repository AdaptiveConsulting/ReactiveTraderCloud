import { Page, TestInfo } from "@playwright/test"

const TRADE_ID_COLUMN_INDEX = 1 // account for trade state (colour bar) column

export class FxBlotterPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  get tradeFilterButton() {
    return this.page.locator('[aria-label*="Open Trade ID"]')
  }

  get primaryFilter() {
    return this.page.locator('[aria-label*="Primary filter"]')
  }

  get exportToCsvButton() {
    return this.page.locator('[aria-label="Export to CSV"]')
  }

  get filterButton() {
    return this.page.getByTestId("filter-button")
  }

  get firstTradeRow() {
    return this.page.locator('[role="grid"] > div').nth(1).locator("div")
  }

  get tradeIDCellContent() {
    return this.firstTradeRow.nth(TRADE_ID_COLUMN_INDEX).textContent()
  }

  get tradeIDColHeader() {
    return this.page.getByText("Trade ID", {
      exact: true,
    })
  }

  tradesGridRow(tradeId: string) {
    return this.page
      .getByTestId(`trades-grid-row-${tradeId}`)
      .locator("div")
      .nth(1)
  }
}
