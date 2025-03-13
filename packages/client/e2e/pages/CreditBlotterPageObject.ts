import { Page, WorkerInfo } from "@playwright/test"

export class CreditBlotterPageObject {
  constructor(
    readonly page: Page,
    readonly workerInfo: WorkerInfo,
  ) {}

  blotterCellForTradeId(tradeId: string) {
    return this.page.locator("div").getByText(tradeId, { exact: true }).first()
  }
}
