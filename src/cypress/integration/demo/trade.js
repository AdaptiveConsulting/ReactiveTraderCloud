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

Then('trade is success for {string}', notional => {
  cy.verifyTradeSuccess(notional)
})
Then('trade is rejected for {string}', notional => {
  cy.verifyTradeRejected(notional)
})

Then('trade is timed-out and then success for {string}', notional => {
  cy.verifyTradeTimeoutAndSuccess(notional)
})
