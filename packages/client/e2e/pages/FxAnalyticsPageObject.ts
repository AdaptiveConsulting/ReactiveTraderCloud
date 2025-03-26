import { Page, TestInfo } from "@playwright/test"

export class FxAnalyticsPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  get lastPnLPosition() {
    return this.page.getByTestId("lastPosition")
  }

  bubble(currency: string) {
    return this.page.locator("g.node").filter({ hasText: currency })
  }

  bubbleTooltip(currency: string) {
    return this.page.locator("[data-testid='tooltip']", { hasText: currency })
  }

  pnlAmount(currencyPair: string) {
    return this.page
      .getByTestId(`pnlbar-${currencyPair}`)
      .getByTestId("priceLabel")
  }
}
