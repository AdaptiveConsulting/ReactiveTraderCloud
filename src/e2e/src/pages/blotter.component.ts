import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { mapAsync } from '../utils/async.utils'
import { waitForElementToBePresent, waitForElementToBeVisible } from '../utils/browser.utils'

export interface BlotterHeader {
  id: string
  label: string
}

type TradeProperties =
  | 'latestTrade'
  | 'tradeID'
  | 'tradeStatus'
  | 'tradeDate'
  | 'tradeDirection'
  | 'tradeCCYCCY'
  | 'tradeDealtCCY'
  | 'tradeNotional'
  | 'tradeRate'
  | 'tradeValueDate'
  | 'tradeBackGroundColour'

export class BlotterComponent {
  tradesTable: Record<'executedTrades', Record<TradeProperties, ElementFinder>>

  constructor(private browser: ProtractorBrowser, public root: ElementFinder) {}
  async getTradeId(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-tradeId`))
    return trade
  }

  async getTradeStatus(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-status`))
    return trade
  }

  async getTradeDate(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-tradeDate`))
    return trade
  }

  async getTradeDirection(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-direction`))
    return trade
  }

  async getLatestTrade() {
    const latestTrade = this.root.element(by.css("[col-id='tradeId']" + '.ag-cell'))
    await waitForElementToBePresent(this.browser, latestTrade)
    return latestTrade.getText()
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

  async toBeVisible(element: TradeProperties) {
    const textElement = this.tradesTable.executedTrades[element]
    if (!textElement) {
      throw new Error(`could not find element with symbol ${element}`)
    }
    await waitForElementToBeVisible(this.browser, textElement)
  }
}
