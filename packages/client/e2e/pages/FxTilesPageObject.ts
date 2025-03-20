import { Page, TestInfo } from "@playwright/test"

export class FxTilesPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  get tradeId() {
    return this.page.getByTestId("trade-id")
  }

  get spotTileNotionalInput() {
    return this.page.locator("input[id='notional-input-EURUSD']")
  }

  clickCurrency(currency: string) {
    return this.page.getByTestId("tab-bar-tabs").getByText(currency).click()
  }

  buy(currencyPair: string) {
    return this.page.getByTestId(`Buy-${currencyPair}`).click()
  }

  sell(currencyPair: string) {
    return this.page.getByTestId(`Sell-${currencyPair}`).click()
  }
}
