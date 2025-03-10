import { Page } from "@playwright/test"
export class CreditRfqTilesPageObject {
  constructor(readonly page: Page) {}

  // TODO - these tiles filter functions will not work in squashed resonsive mode

  async selectLiveRfqsFilter() {
    const collapsedNav = this.page.getByTestId("nav-dropdown")
    const displayStyle = await collapsedNav.evaluate(
      (el) => getComputedStyle(el).display,
    )
    if (displayStyle == "none") {
      return this.page.getByTestId("tabItem-Live").first().click()
    } else {
      collapsedNav.click()
      return this.page.click(':nth-match(:text("Live"), 2)')
    }
  }

  async selectAllRfqsFilter() {
    const collapsedNav = this.page.getByTestId("nav-dropdown")
    const displayStyle = await collapsedNav.evaluate(
      (el) => getComputedStyle(el).display,
    )
    if (displayStyle == "none") {
      return this.page.getByTestId("tabItem-All").click()
    } else {
      collapsedNav.click()
      return collapsedNav.getByText(/All/).click()
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
