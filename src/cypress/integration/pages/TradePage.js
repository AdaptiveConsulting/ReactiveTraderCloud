class TradePage {
  static getTile(symbol) {
    return cy.get('div[data-testid="tile-' + symbol.replace('/', '') + '"]')
  }
  getNotionalField(symbol) {
    return TradePage.getTile(symbol).find('input')
  }

  getCurrentPrice(symbol, direction) {
    return TradePage.getTile(symbol).find('button[direction=' + direction + '] > div > div')
  }

  getDirectionButton(symbol, direction) {
    return TradePage.getTile(symbol).find('button[direction=' + direction + ']')
  }

  getRFQButton(symbol) {
    return TradePage.getTile(symbol).find(
      'div > div > div:nth-child(2)  > div:nth-child(2) > div > div:nth-child(4) button'
    )
  }

  getRejectButton(symbol) {
    return TradePage.getTile(symbol).find('button[data-testid=rfqReject]')
  }
  getRequoteButton(symbol) {
    return TradePage.getTile(symbol).find(
      'div > div > div:nth-child(2)  > div:nth-child(2) > div > div:nth-child(4) button'
    )
  }

  getTileResponseMessage(symbol) {
    return TradePage.getTile(symbol).find('div[role=dialog] > div[role=alert]')
  }

  getNotionalValue(symbol) {
    return TradePage.getTile(symbol)
      .find(' input')
      .invoke('attr', 'value')
  }

  getPriceViewButton() {
    return cy.get('li[data-qa-id=workspace-view-Analytics] > svg > g')
  }

  getGraphViewButton() {
    return cy.get('li[data-qa-id=workspace-view-Normal] > svg > g')
  }

  getPriceView() {
    return cy.get('svg')
  }
  getCurrencyTab(currency) {
    return cy.get('li[data-testid="menuButton-' + currency + '"]')
  }

  getCurrencyCombinationList() {
    return cy.get('div[data-testid*=tile-]')
  }
}
export default TradePage
