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

  constructor(private browser: ProtractorBrowser, public root: ElementFinder) {
    // this.tradesTable = {
    //   executedTrades: {
    //     latestTrade: root.element(by.css("[col-id='tradeId']" + ".ag-cell")),
    //     tradeID: root.element(by.qa(`306-tradeId`)),
    //     tradeStatus: root.element(by.qa(`1-status`)),
    //     tradeDate: root.element(by.qa(`1-tradedate`)),
    //     tradeDirection: root.element(by.qa(`1-direction`)),
    //     tradeCCYCCY: root.element(by.qa(`1-symbol`)),
    //     tradeDealtCCY: root.element(by.qa(`1-dealtCurrency`)),
    //     tradeNotional: root.element(by.qa(`1-notional`)),
    //     tradeRate: root.element(by.qa(`1-spotRate`)),
    //     tradeValueDate: root.element(by.qa(`1-valueDate`)),
    //     tradeBackGroundColour: root.element(
    //       by.css(
    //         '[data-qa="shell-route__blotter-wrapper"] .ag-body .ag-row:nth-child(1) [col-id="statusIndicator"]'
    //       )
    //     )
    //   }
    // }
  }
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

  async getTradeCCYCCY(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-symbol`))
    return trade
  }

  async getTradeDealtCCY(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-dealtCurrency`))
    return trade
  }

  async getTradeNotional(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-notional`))
    return trade
  }

  async getTradeRate(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-spotRate`))
    return trade
  }

  async getTradeValueDate(num: string): Promise<ElementFinder> {
    const trade = await this.root.element(by.qa(`${num}-valueDate`))
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
