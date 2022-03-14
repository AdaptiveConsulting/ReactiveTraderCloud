import TradePage from '../integration/pages/TradePage'
let currentPrice = ''
let finalAmount = 0
let currency
let waitingText
let confirmationText
let tradeText

let tradePage = new TradePage()
Cypress.Commands.add('VerifyCurrencyOnPage', symbol => {
  tradePage
    .getSymbol(symbol)
    .scrollIntoView()
    .should('be.visible')
})

Cypress.Commands.add('verifyDisabledDirections', symbol => {
  tradePage.getDirectionButton(symbol.replace('/', ''), 'Buy').should('be.disabled')
  tradePage.getDirectionButton(symbol.replace('/', ''), 'Sell').should('be.disabled')
})

Cypress.Commands.add('clickInitateRFQ', symbol => {
  tradePage.getRFQButton(symbol.replace('/', '')).click()
})

Cypress.Commands.add('verifyEnabledDirections', symbol => {
  tradePage.getDirectionButton(symbol.replace('/', ''), 'Buy').should('not.be.disabled')
  tradePage.getDirectionButton(symbol.replace('/', ''), 'Sell').should('not.be.disabled')
})

Cypress.Commands.add('verifyRequoteButton', symbol => {
  tradePage.getRFQButton(symbol.replace('/', '')).then(el => {
    expect(el.text()).to.be.equal('Requote')
  })
})

Cypress.Commands.add('editNotionalValue', (notional, symbol) => {
  cy.reload()
  tradePage
    .enterNotional(symbol.replace('/', ''))
    .clear()
    .type(notional)
})

Cypress.Commands.add('clickOnRejectButton', symbol => {
  tradePage.getRejectButton(symbol.replace('/', '')).click()
})

Cypress.Commands.add('clickOnRejectButton', symbol => {
  tradePage.getRejectButton(symbol.replace('/', '')).click()
})

Cypress.Commands.add('clickOnRequoteButton', symbol => {
  tradePage.getRequoteButton(symbol.replace('/', '')).click()
})

Cypress.Commands.add('clickOnRequoteButton', symbol => {
  tradePage.getRequoteButton(symbol.replace('/', '')).click()
})

Cypress.Commands.add('verifyNotionalValue', (expected, symbol) => {
  tradePage.getNotionalValue(symbol.replace('/', '')).should('contain', expected)
})

Cypress.Commands.add('verifyErrorMessage', (expected, symbol) => {
  cy.contains(expected).should('be.visible')
})

Cypress.Commands.add('performTrade', (symbol, notional, direction) => {
  currency = symbol.replace('/', '')

  cy.log('').then(() => {
    tradePage
      .enterNotional(currency)
      .clear()
      .type(notional)
    tradePage.getCurrentPrice(currency, direction).each((el, index, list) => {
      if (index == 0) {
        // to get the current price text from the selected element
        currentPrice = el.find('div:nth-child(2)').text()
      } else {
        currentPrice = currentPrice + el.text()
      }
    })
  })

  cy.log('').then(() => {
    cy.log('current price is ' + currentPrice)
    if (Number(currentPrice) % 10 == 0) {
      currentPrice = Number(currentPrice) / 10
    }
    finalAmount = Number(currentPrice) * Number(notional)

    tradePage.getDirectionButton(currency, direction).click({ force: true })
    if (currency == 'EURJPY') {
      cy.wait(2000)
      tradePage.getWaitingTextMessage(currency).then(el => {
        cy.log('waiting text ' + el.text())
        waitingText = el.text()

        cy.wait(3000)
      })
    } else {
      cy.wait(5000)
    }

    tradePage.getConfirmationTextMessage(currency).then(el => {
      cy.log('Confirmation text ' + el.text())
      confirmationText = el.text()
    })
  })
})

Cypress.Commands.add('verifyTradeRejected', () => {
  cy.log('').then(() => {
    expect(confirmationText).to.eq('Your trade has been rejected')
  })
})

Cypress.Commands.add('verifyPriceView', () => {
  tradePage
    .getPriceView()
    .find('path[stroke]')
    .should('have.length', 1)
})
Cypress.Commands.add('verifyGraphView', () => {
  tradePage
    .getPriceView()
    .find('path[stroke]')
    .should('have.length', 10)
})
Cypress.Commands.add('clickPriceView', () => {
  tradePage.getPriceViewButton().click({ force: true })
})

Cypress.Commands.add('clickGraphView', () => {
  tradePage.getGraphViewButton().click({ force: true })
})

Cypress.Commands.add('clickCurrencyTab', currency => {
  if (currency.toLowerCase() == 'all') {
    tradePage.getCurrencyTab('Symbol(all)').click({ force: true })
  } else {
    tradePage.getCurrencyTab(currency).click({ force: true })
  }
})

Cypress.Commands.add('verifyCurrencyCombination', currency => {
  if (currency.toLowerCase() == 'all') {
    tradePage.getCurrencyCombinationList().should('have.length', 9)
  } else {
    tradePage
      .getCurrencyCombinationList()
      .invoke('attr', 'data-testid')
      .should('contain', currency)
  }
})

Cypress.Commands.add('verifyTradeSuccess', (notional, operation) => {
  if (operation.toLowerCase() == 'buy') {
    tradeText = 'bought'
  } else {
    tradeText = 'sold'
  }
  cy.log('').then(() => {
    let validatedText =
      'You ' +
      tradeText +
      ' ' +
      currency.substring(0, 3) +
      ' ' +
      notional +
      ' at a rate of ' +
      currentPrice.replace(/[,.]/g, '') +
      ' for ' +
      currency.substring(3, 6) +
      ' ' +
      finalAmount
    ;(' settling (Spt)')
    expect(confirmationText.replace(/[,.]/g, '')).to.include(validatedText)
  })
})

Cypress.Commands.add('verifyTradeTimeoutAndSuccess', (notional, operation) => {
  if (operation.toLowerCase() == 'buy') {
    tradeText = 'bought'
  } else {
    tradeText = 'sold'
  }
  cy.log('').then(() => {
    expect(waitingText).to.eq('Trade execution taking longer than expected')

    let validatedText =
      'You ' +
      tradeText +
      ' ' +
      currency.substring(0, 3) +
      ' ' +
      notional +
      ' at a rate of ' +
      currentPrice.replace(/[,.]/g, '') +
      ' for ' +
      currency.substring(3, 6) +
      ' ' +
      finalAmount
    ;(' settling (Spt)')
    expect(confirmationText.replace(/[,.]/g, '')).to.include(validatedText)
  })
})

//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
