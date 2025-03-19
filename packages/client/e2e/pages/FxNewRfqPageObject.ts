import { Page, TestInfo } from "@playwright/test"

export class FxNewRfqPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  async clickCurrency(currency: string) {
    return await this.page
      .getByTestId("tab-bar-tabs")
      .getByText(currency)
      .click()
  }

  get spotTileNotionalInput() {
    return this.page.locator("input[id='notional-input-EURUSD']")
  }

  async buyCurrencyPair(pair: string) {
    return await this.page.getByTestId(`Buy-${pair}`).click()
  }

  async sellCurrencyPair(pair: string) {
    return await this.page.getByTestId(`Sell-${pair}`).click()
  }

  get tradeId() {
    return this.page.getByTestId("trade-id")
  }
}
