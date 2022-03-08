// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

let currentPrice = ''
let textList
let finalList = []
let finalAmount = 0
const dayjs = require('dayjs')
var currentYear = dayjs().get('year')
let currency
let waitingText

// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

Cypress.Commands.add('VerifyCurrencyOnPage', symbol => {
  cy.get('div[data-testid="tile-' + symbol.replace('/', '') + '"]')
    .scrollIntoView()
    .should('be.visible')
})

Cypress.Commands.add('performTrade', (symbol, notional, direction) => {
  finalList.length = 0
  currency = symbol.replace('/', '')

  cy.log('').then(() => {
    cy.get('div[data-testid="tile-' + currency + '"] input')
      .clear()
      .type(notional)
    cy.get(
      'div[data-testid="tile-' +
        currency +
        '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' +
        direction +
        '] > div > div'
    ).each((el, index, list) => {
      if (index == 0) {
        currentPrice = el.find('div:nth-child(2)').text()
      } else {
        currentPrice = currentPrice + el.text()
      }
    })
  })

  cy.log('').then(() => {
    cy.log('current price is ' + currentPrice)
    finalAmount = Number(currentPrice) * Number(notional)

    cy.get(
      'div[data-testid="tile-' +
        currency +
        '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' +
        direction +
        ']'
    ).click({ force: true })
    if (currency == 'EURJPY') {
      cy.wait(2000)
      cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then(
        el => {
          cy.log('waiting text ' + el.text())
          waitingText = el.text()

          cy.wait(3000)
        }
      )
    } else {
      cy.wait(5000)
    }
    cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then(
      el => {
        let tradeIDList = el.text().split(' ')
        finalList.push(tradeIDList[2])
      }
    )
    cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then(el => {
      cy.log('Confirmation text ' + el.text())
      let confirmationText = el.text()
      if (el.text().includes('rejected')) {
        textList = confirmationText.split(' ')
        finalList.push(textList[4])

        finalList.push(currentYear)
        finalList.push(direction)
        finalList.push(currency)
        if (direction.toLowerCase() == 'buy') {
          finalList.push(currency.substring(0, 3))
        } else {
          finalList.push(currency.substring(3, 6))
        }
        finalList.push(notional)
        finalList.push(currentPrice)
        finalList.push(currentYear)
        finalList.push('JPW')
      } else {
        textList = el.text().split(' ')
        finalList.push('Done')
        finalList.push(textList[14] + '-' + textList[15].replace('.', '') + '-' + currentYear)
        finalList.push(direction)
        finalList.push(textList[2] + textList[10])
        if (direction.toLowerCase() == 'buy') {
          finalList.push(textList[2])
        } else {
          finalList.push(textList[10])
        }
        finalList.push(textList[3])
        finalList.push(textList[8])
        finalList.push(textList[14] + '-' + textList[15].replace('.', '') + '-' + currentYear)
        finalList.push('JPW')
      }
    })
  })
})

Cypress.Commands.add('verifyTradeRejected', () => {
  cy.log('').then(() => {
    expect('rejected').to.eq(finalList[1])
  })
})

Cypress.Commands.add('verifyTradeSuccess', notional => {
  cy.log('').then(() => {
    expect(Number(currentPrice)).to.eq(Number(finalList[7]))
    expect(Number(notional)).to.eq(Number(textList[3].replace(/,/g, '')))
    expect(Math.round(Number(finalAmount))).to.eq(
      Math.round(Number(textList[11].replace(/,/g, '')))
    )
    expect(currency).to.eq(textList[2] + textList[10])
  })
})

Cypress.Commands.add('verifyTradeTimeoutAndSuccess', notional => {
  cy.log('').then(() => {
    expect(waitingText).to.eq('Trade execution taking longer than expected')
    expect(Number(currentPrice)).to.eq(Number(finalList[7]))
    expect(Number(notional)).to.eq(Number(textList[3].replace(/,/g, '')))
    expect(Math.round(Number(finalAmount))).to.eq(
      Math.round(Number(textList[11].replace(/,/g, '')))
    )
    expect(currency).to.eq(textList[2] + textList[10])
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
