import { Page, TestInfo } from "@playwright/test";

export class FxBlotterPageObject {
    constructor(
        readonly page: Page
    ) {}

    async tradesGridRow(tradeId: string) {
        return await this.page.getByTestId(`trades-grid-row-${tradeId}`).locator('div').nth(1)
    }
}