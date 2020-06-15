import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { mapAsync } from '../utils/async.utils'
import { waitForElementToBePresent } from '../utils/browser.utils'

export interface BlotterHeader {
  id: string
  label: string
}

export class BlotterComponent {
  tradesTable: Record<string, Record<string, ElementFinder>>

  constructor(private browser: ProtractorBrowser, public root: ElementFinder, num?: number) {
    this.tradesTable = {
      executedTrades: {
        tradeID: root.element(by.qa('16-tradeId')),
        tradeStatus: root.element(by.qa(`${num}-status`)),
        tradeDate: root.element(by.qa(`${num}-tradedate`)),
        tradeDirection: root.element(by.qa(`${num}-direction`)),
        tradeCCYCCY: root.element(by.qa(`${num}-symbol`)),
        tradeDealtCCY: root.element(by.qa(`${num}-dealtCurrency`)),
        tradeNotional: root.element(by.qa(`${num}-notional`)),
        tradeRate: root.element(by.qa(`${num}-spotRate`)),
        tradeValueDate: root.element(by.qa(`${num}-valueDate`)),
        tradeBackGroundColour: root.element(
          by.css(
            '[data-qa="shell-route__blotter-wrapper"] .ag-body .ag-row:nth-child(1) [col-id="statusIndicator"]'
          )
        )
      }
    }
  }

  async getHeaders(): Promise<BlotterHeader[]> {
    const headerRow = this.root.element(by.css('.ag-header-viewport .ag-header-row'))
    await waitForElementToBePresent(this.browser, headerRow)

    const headerCells: ElementFinder[] = await headerRow.all(by.css('.ag-header-cell'))
    return mapAsync(
      headerCells,
      async (cell): Promise<BlotterHeader> => {
        return {
          id: await cell.getAttribute('col-id'),
          label: await cell.element(by.css('.ag-header-cell-text')).getAttribute('textContent')
        }
      }
    )
  }
}
