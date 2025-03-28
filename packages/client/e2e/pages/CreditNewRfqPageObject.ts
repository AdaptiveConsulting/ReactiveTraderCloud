import { Page, WorkerInfo } from "@playwright/test"

export class CreditNewRfqPageObject {
  constructor(
    readonly page: Page,
    readonly workerInfo: WorkerInfo,
  ) {}

  get cusipInput() {
    return this.page.getByPlaceholder(/Enter a CUSIP/)
  }

  firstCusipEntryForSymbol(symbol: string) {
    return this.page.getByTestId("search-result-item").getByText(symbol).first()
  }

  get quantityField() {
    return this.page.getByLabel("Quantity (000)")
  }

  selectAllCounterparties() {
    return this.page.getByLabel(/All/).click()
  }

  selectAdaptiveBankCounterparty() {
    return this.page.getByLabel(/Adaptive Bank/).click()
  }

  get sendRFQButton() {
    return this.page.locator("button").getByText(/Send RFQ/)
  }
}
