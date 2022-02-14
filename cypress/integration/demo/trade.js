import { Given, When, Then, And} from 'cypress-cucumber-preprocessor/steps'



Given('Reactive Trader is open', () => {

    //cy.visit("https://web.prod.reactivetrader.com/")
    cy.visit("http://localhost:1925")



})
And('{string} price tile is displayed', (symbol) => {
    cy.VerifyCurrencyOnPage(symbol)

})

When('user performs {string} trade for {string} of {string}', (direction, notional, symbol) => {
  
    cy.VerifySuccessTradeExecution(symbol, notional, direction)
})


Then('trade is success', () => {

    cy.task('getListTrade').then((trade) => {
        cy.log('list if trade ' + trade)
        cy.verifyBlotterAfterTrade(trade);
      })  
 

})