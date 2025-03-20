import { Page, TestInfo } from "@playwright/test"

export class FxBlotterPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  async tradesGridRow(tradeId: string) {
    return this.page
      .getByTestId(`trades-grid-row-${tradeId}`)
      .locator("div")
      .nth(1)
  }
}
