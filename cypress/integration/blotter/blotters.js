import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'


Given('User is on Home page', () => {

    //cy.visit("https://web.prod.reactivetrader.com/")
    cy.visit("http://localhost:1920")



})

When('User Clicks on {string} only once', (col) => {
    cy.ClickForDescSorting(col)

})

Then('User should see the sorting happening in Descending order for column {string}', (col) => {
    cy.VerifyDescSortOnTrade(col)


})

When('User Clicks on {string} two times', (col) => {
    cy.ClickForAscSorting(col)

})

Then('User should see the sorting happening in Ascending order for column {string}', (col) => {
    cy.VerifyAscSortOnTrade(col)

})