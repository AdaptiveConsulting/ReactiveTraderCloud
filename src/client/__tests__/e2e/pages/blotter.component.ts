import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { mapAsync } from '../utils/async.utils'
import { waitForElementToBePresent } from '../utils/browser.utils'

export interface BlotterHeader {
  id: string
  label: string
}

export class BlotterComponent {
  tradesTable: Record<string, Record<string, ElementFinder>>

  constructor(private browser: ProtractorBrowser, public root: ElementFinder) {
    this.tradesTable = {
      executedTrades: {
        tradeID: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[2]')),
        tradeStatus: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[3]')),
        tradeDate: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[4]')),
        tradeDirection: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[5]')),
        tradeCCYCCY: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[6]')),
        tradeDealtCCY: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[7]')),
        tradeNotional: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[8]')),
        tradeRate: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[9]')),
        tradeValueDate: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[10]')),
        tradeBackGroundColour: root.element(by.xpath('//*[@id="root"]/div/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[1]'))
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
          label: await cell.element(by.css('.ag-header-cell-text')).getAttribute('textContent'),
        }
      },
    )
  }
}
