import { Page, WorkerInfo } from "@playwright/test"

import { isRfqTilesResponsive } from "../utils"
export class CreditRfqTilesPageObject {
  constructor(
    readonly page: Page,
    readonly workerInfo: WorkerInfo,
  ) {}

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

  get filterTabs() {
    return this.page.getByTestId("tab-bar-tabs")
  }

  get filterDropdown() {
    return this.page.getByTestId("tab-bar-dropdown")
  }

  selectFilter(filter: string) {
    if (isRfqTilesResponsive(this.workerInfo)) {
      this.filterDropdown.click()
      return this.filterDropdown.getByText(filter).click()
    }
    return this.filterTabs.getByText(filter).click()
  }

  firstQuoteForRfqId(rfqId: string) {
    return this.page
      .getByTestId(rfqId)
      .getByTestId("quotes")
      .locator("div")
      .first()
  }
}
