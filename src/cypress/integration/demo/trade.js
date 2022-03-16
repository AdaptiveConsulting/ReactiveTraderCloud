import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps'

Given('Reactive Trader is open', () => {
  cy.visit(Cypress.env('base_url'))
})
And('{string} price tile is displayed', symbol => {
  cy.VerifyCurrencyOnPage(symbol)
})

When('user performs {string} trade for {string} of {string}', (direction, notional, symbol) => {
  cy.performTrade(symbol, notional, direction)
})

Then('trade is success for {string} and {string}', (notional, direction) => {
  cy.verifyTradeSuccess(notional, direction)
})
Then('trade is rejected for {string}', notional => {
  cy.verifyTradeRejected(notional)
})

Then('trade is timed-out and then success for {string} and {string}', (notional, direction) => {
  cy.verifyTradeTimeoutAndSuccess(notional, direction)
})

And('Sell&Buy Buttons are disabled for {string}', symbol => {
  cy.verifyDisabledDirections(symbol)
})

When('User Clicks on Initiate RFQ button for {string}', symbol => {
  cy.clickInitateRFQ(symbol)
})

Then('Sell&Buy Buttons become enable for {string}', symbol => {
  cy.verifyEnabledDirections(symbol)
})
And('After 10 secs Requote button appears for {string}', symbol => {
  cy.wait(10000)
  cy.verifyRequoteButton(symbol)
})

And('User edits the notional field with {string} for {string}', (notional, symbol) => {
  cy.editNotionalValue(notional, symbol)
})

And('User clicks on Reject button for {string}', symbol => {
  cy.clickOnRejectButton(symbol)
})

Then('Requote button again appears on the page for {string}', symbol => {
  cy.verifyRequoteButton(symbol)
})

And('User clicks on Requote button {string}', symbol => {
  cy.clickOnRequoteButton(symbol)
})

Then(
  'After 60 secs Prices will be disapper and requote button appears again for {string}',
  symbol => {
    cy.wait(10000) // there is a bug in flow
    cy.verifyRequoteButton(symbol)
  }
)

Then(
  'User sees the {string} value on {string} field for {string}',
  (expected, notional, symbol) => {
    if (notional == '1m' || notional == '1k') {
      cy.verifyNotionalValue(expected, symbol)
    } else {
      cy.verifyErrorMessage(expected, symbol)
    }
  }
)

When('User clicks on price view', () => {
  cy.clickPriceView()
})

Then('User is not able to see price graph for any Currencies', () => {
  cy.verifyPriceView()
})

And('User clicks on graph view', () => {
  cy.wait(2000)
  cy.clickGraphView()
})

Then('User is able to see price graph for all currencies', () => {
  cy.verifyGraphView()
})

And('User clicks on {string} tab', currency => {
  cy.clickCurrencyTab(currency)
})

Then('User sees currency combination only for {string}', currency => {
  cy.verifyCurrencyCombination(currency)
})
