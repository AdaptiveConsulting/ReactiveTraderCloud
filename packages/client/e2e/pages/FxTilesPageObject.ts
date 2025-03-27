import { Page, TestInfo } from "@playwright/test"

export class FxTilesPageObject {
  constructor(
    readonly page: Page,
    readonly testInfo: TestInfo,
  ) {}

  get tradeId() {
    return this.page.getByTestId("trade-id")
  }

  get rfqButton() {
    return this.page.getByTestId("rfqButton")
  }

  get rfqTimer() {
    return this.page.getByTestId("rfqTimer")
  }

  notionalInput(currency: string) {
    return this.page.locator(`input[id='notional-input-${currency}']`)
  }

  selectFilter(currency: string) {
    return this.page.getByTestId("tab-bar-tabs").getByText(currency).click()
  }

  buy(currencyPair: string) {
    return this.page.getByTestId(`Buy-${currencyPair}`).click()
  }

  sell(currencyPair: string) {
    return this.page.getByTestId(`Sell-${currencyPair}`).click()
  }

  dialogText(text: string | RegExp) {
    return this.page.locator("div[role='dialog']").getByText(text)
  }

  textValue(text: string) {
    return this.page.getByText(text)
  }
}
