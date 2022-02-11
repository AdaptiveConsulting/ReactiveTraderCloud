import { Given, When, Then, And} from 'cypress-cucumber-preprocessor/steps'



Given('Reactive Trader is open', () => {

    //cy.visit("https://web.prod.reactivetrader.com/")
    cy.visit("http://localhost:1920")



})
And('{string} price tile is displayed', (combination) => {
    cy.VerifyCurrencyOnPage(combination)

})

When('user performs {string} trade for {string} of {string}', (operation, quantity, combination) => {
  
    cy.VerifySuccessTradeExecution(combination, quantity, operation)
})


Then('trade is success', () => {

    cy.task('getListTrade').then((trade) => {
        cy.log('list if trade ' + trade)
        cy.verifyBlotterAfterTrade(trade);
      })  
 

})