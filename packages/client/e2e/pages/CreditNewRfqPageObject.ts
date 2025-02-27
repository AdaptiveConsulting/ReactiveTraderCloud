import { Page } from "@playwright/test"

export class CreditNewRfqPageObject {
  constructor(readonly page: Page) {}

  get cusipInput() {
    return this.page.getByPlaceholder(/Enter a CUSIP/)
  }

  firstCusipEntryForSymbol(symbol: string) {
    return this.page.getByTestId("search-result-item").getByText(symbol).first()
  }

  get quantityField() {
    return this.page.getByLabel("Quantity (000)")
  }

  get adaptiveBankToggle() {
    return this.page.getByLabel(/Adaptive Bank/)
  }

  get sendRFQButton() {
    return this.page.locator("button").getByText(/Send RFQ/)
  }
}
