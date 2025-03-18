import { Page, WorkerInfo } from "@playwright/test"

import { isRfqTilesResponsive } from "../utils"
export class CreditRfqTilesPageObject {
  constructor(
    readonly page: Page,
    readonly workerInfo: WorkerInfo,
  ) {}

  async selectFilter(filter: string) {
    if (isRfqTilesResponsive(this.workerInfo)) {
      this.page.getByTestId("rfqs-filter-dropdown").click()
      return await this.page
        .getByTestId("rfqs-filter-dropdown")
        .getByText(filter)
        .click()
    } else {
      return this.page
        .getByTestId("rfqs-filter-tab-bar")
        .getByText(filter)
        .click()
    }
  }

  get firstQuote() {
    return this.page
      .getByTestId(/^rfq-/)
      .first()
      .getByTestId("quotes")
      .locator("div")
      .first()
  }

  get firstAcceptButton() {
    return this.firstQuote.getByText(/Accept/).first()
  }

  get firstViewTradeButton() {
    return this.page.getByTestId("view-trade").first()
  }

  get firstRfqTile() {
    return this.page.getByTestId(/^rfq-/).first()
  }

  firstQuoteForRfqId(rfqId: string) {
    return this.page
      .getByTestId(rfqId)
      .getByTestId("quotes")
      .locator("div")
      .first()
  }
}
