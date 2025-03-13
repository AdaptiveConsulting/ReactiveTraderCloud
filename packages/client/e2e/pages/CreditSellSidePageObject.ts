import { Page, WorkerInfo } from "@playwright/test"

export class CreditSellSidePageObject {
  constructor(
    readonly page: Page,
    readonly workerInfo: WorkerInfo,
  ) {}

  get firstNewRfqInGrid() {
    return this.page.locator("div").getByText("New RFQ").first()
  }

  get priceField() {
    return this.page.getByTestId("price-input")
  }

  get passButton() {
    return this.page.getByRole("button", { name: "Pass" })
  }

  submitQuote() {
    return this.page.keyboard.press("Enter")
  }
}
