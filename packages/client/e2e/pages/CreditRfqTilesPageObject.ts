import { Page } from "@playwright/test"

export class CreditRfqTilesPageObject {
  constructor(readonly page: Page) {}

  // TODO - these tiles filter functions will not work in squashed resonsive mode
  selectLiveRfqsFilter() {
    return this.page.getByText(/Live/).first().click()
  }

  selectAllRfqsFilter() {
    return this.page.getByTestId("tabItem-All").click()
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
