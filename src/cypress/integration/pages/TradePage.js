class TradePage {
  getSymbol(symbol) {
    return cy.get('div[data-testid="tile-' + symbol.replace('/', '') + '"]')
  }
  enterNotional(symbol) {
    return cy.get('div[data-testid="tile-' + symbol + '"] input')
  }

  getCurrentPrice(symbol, direction) {
    return cy.get(
      'div[data-testid="tile-' +
        symbol +
        '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' +
        direction +
        '] > div > div'
    )
  }

  getDirectionButton(symbol, direction) {
    return cy.get(
      'div[data-testid="tile-' +
        symbol +
        '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' +
        direction +
        ']'
    )
  }

  getRFQButton(symbol) {
    return cy.get(
      'div[data-testid="tile-' +
        symbol +
        '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > div:nth-child(4) button'
    )
  }

  getRejectButton(symbol) {
    return cy.get('div[data-testid="tile-' + symbol + '"] button[data-testid=rfqReject]')
  }
  getRequoteButton(symbol) {
    return cy.get(
      'div[data-testid="tile-' +
        symbol +
        '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > div:nth-child(4) button'
    )
  }

  getWaitingTextMessage(symbol) {
    return cy.get('div[data-testid=tile-' + symbol + '] div[role=dialog] > div[role=alert]')
  }

  getConfirmationTextMessage(symbol) {
    return cy.get('div[data-testid=tile-' + symbol + '] div[role=dialog] > div[role=alert]')
  }

  getNotionalValue(symbol) {
    return cy.get('div[data-testid="tile-' + symbol + '"] input').invoke('attr', 'value')
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
