import { Page, TestInfo } from "@playwright/test"

export class FxAnalyticsPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  get lastPnLPosition() {
    return this.page.getByTestId("lastPosition")
  }

  currencyCircle(currency: string) {
    return this.page.locator("g.node").filter({ hasText: currency })
  }

  PnLAmount(currencyPair: string) {
    return this.page
      .getByTestId(`pnlbar-${currencyPair}`)
      .getByTestId("priceLabel")
  }
}
