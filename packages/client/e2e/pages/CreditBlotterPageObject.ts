import { Page } from "@playwright/test"

export class CreditBlotterPageObject {
  constructor(readonly page: Page) {}

  blotterCellForTradeId(tradeId: string) {
    return this.page.locator("div").getByText(tradeId, { exact: true }).first()
  }
}
