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

import { isExportDeclaration } from "typescript"
import BlotterPage from '../pages/BlotterPage'


const blotterPage = new BlotterPage();

// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })


Cypress.Commands.add('VerifyCurrencyOnPage', (combination) => {
  let currency = combination.replace('/','')

  cy.log('').then(() => { 
  cy.get('div[data-testid="tile-' + currency + '"]').scrollIntoView().should('be.visible');
  })


})

Cypress.Commands.add('VerifySuccessTradeExecution', (combination, quantity, direction) => {

  let currentPrice = ''
  let textList
  let finalList = []
  let finalAmount = 0
  const dayjs = require('dayjs')
  var currentYear = dayjs().get('year')
  let currency = combination.replace('/','')

  cy.log('').then(() => { 
  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2) div:nth-child(2) input').clear().type(quantity)
  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + '] > div > div').each((el, index, list) => {
    if (index == 0) {
      currentPrice = el.find('div:nth-child(2)').text()
    }
    else {

      currentPrice = currentPrice + el.text()
    }


  })
})

  cy.log('').then(() => {

    cy.log('current price is ' + currentPrice)
    finalAmount = Number(currentPrice) * Number(quantity)

  })


  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + ']').click({ force: true })
  cy.wait(5000)
  // cy.get('html:root').eq(0).invoke('prop', 'innerHTML').then((doc) => {
  //   cy.writeFile('pageMarkup.html', doc);
  // });
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then((el) => {

    
    let tradeIDList = el.text().split(' ')
    finalList.push(tradeIDList[2])

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then((el) => {

   
    cy.log("Confirmation text " + el.text())
    //You bought EUR 30,000 at a rate of 1.36348 for USD 40,904.4 settling (Spt) 25 Jan.

    textList = el.text().split(' ')
    finalList.push('Done')
    finalList.push(textList[14]+"-"+textList[15].replace('.','')+"-"+currentYear)
    finalList.push(direction)
    finalList.push(textList[2] + textList[10])
    if(direction.toLowerCase() == 'buy') {
    finalList.push(textList[2])
    }
    else {
      finalList.push(textList[10])
    }
    finalList.push(textList[3])
    finalList.push(textList[8])
    finalList.push(textList[14]+"-"+textList[15].replace('.','')+"-"+currentYear)
    finalList.push('JPW')


    expect(Number(currentPrice)).to.eq(Number(finalList[7]))
    expect(Number(quantity)).to.eq(Number(textList[3].replace(/,/g, '')))
    expect(Math.round(Number(finalAmount))).to.eq(Math.round(Number(textList[11].replace(/,/g, ''))))
    expect(currency).to.eq(textList[2] + textList[10])

    cy.task('setListTrade',finalList);
    

  })

})

Cypress.Commands.add('VerifyRejectedTradeExecution', (currency, quantity, direction) => {

  let finalList = []
  const dayjs = require('dayjs')
  let currentYear = dayjs().subtract(1,'day').format('DD-MMM-YYYY')
  let currentPrice =''

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2) div:nth-child(2) input').clear().type(quantity)
  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + '] > div > div').each((el, index, list) => {
    if (index == 0) {
      currentPrice = el.find('div:nth-child(2)').text()
    }
    else {

      currentPrice = currentPrice + el.text()
    }


  })

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + ']').click({ force: true })
  cy.wait(2000)


  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(1)').then((el) => {

    

  //  finalList.push(el.text().replace('/', ''))

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then((el) => {

   
    let tradeIDList = el.text().split(' ')
    finalList.push(tradeIDList[2])

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then((el) => {

    let confirmationText = el.text()
    cy.log("Confirmation text " + confirmationText)
    //Your trade has been rejected

    let textList = confirmationText.split(' ')
    finalList.push(textList[4])

    finalList.push(currentYear)
    finalList.push(direction)
    finalList.push(currency)
    if(direction.toLowerCase() == 'buy') {
    finalList.push(currency.substring(0,3))
    }
    else {
      finalList.push(currency.substring(3,6))
    }
    finalList.push(quantity)
    finalList.push(currentPrice)
    finalList.push(currentYear)
    finalList.push('JPW')

    expect("rejected").to.eq(finalList[1])
    expect(currency).to.eq(finalList[4])

    cy.task('setListTrade',finalList);
  })
  

})


Cypress.Commands.add('verifyBlotterAfterTrade', (tradeParam) => {

 // cy.get('caption[id=trades-table-heading]+thead th:nth-child(2) div').should('be.visible').click()

  var tradeNumber = 0;
  const dayjs = require('dayjs')
  var todayDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY')  //only for mock

  // capture the last trade id...   better create func..
  cy.get('caption[id=trades-table-heading]+thead+tbody tr:nth-child(1) td').eq(1).then(el => {
    tradeNumber = Number(el.text())
  })


  cy.get('caption[id=trades-table-heading]+thead+tbody tr:nth-child(1) td').each((el, index, list) => {

    if (index == 0) {
       
    }
    else if(index == 8) {

      expect(Number(el.text().replace(/,/g,''))).to.eq(Number(tradeParam[index-1].toString().replace(/,/g,'')))
      //expect(el.text().replace(/,/g,'').replace(/(\.0+|0+)$/, '').toLowerCase()).to.eq(tradeParam[index-1].replace(/,/g,'').replace(/(\.0+|0+)$/, '').toLowerCase())
      //expect(el.text().replace(/,/g,'').replace(/\.00/g,'').toLowerCase()).to.eq(tradeParam[index-1].replace(/,/g,'').replace(/\.00/g,'').toLowerCase())
    }
    else {
      expect(el.text().replace(/,/g,'').toLowerCase()).to.eq(tradeParam[index-1].toString().replace(/,/g,'').toLowerCase())
    }

  })

})

Cypress.Commands.add('getTradeCount', () => {

  let listingCount = 0
  cy.get('caption[id=trades-table-heading]+thead+tbody').find('tr').then(count => {
    listingCount = Cypress.$(count).length

    cy.log("count " + listingCount)
    return cy.wrap(listingCount)
  })
})

Cypress.Commands.add('verifyToggle', () => {

  cy.get('div[data-testid="theme-toggle-switch"]').then((el) => {
  

    if (el.find('svg[viewBox="0 0 12 12"]').length > 0){
      cy.get('div[data-testid="theme-toggle-switch"] div').eq(0).click({force:true,multiple:true})
    
      cy.get('div[data-testid="theme-toggle-switch"]').click()

      cy.get('svg[viewBox="0 0 14 14"]').should('be.visible')
      
     }
    else {
      cy.get('div[data-testid="theme-toggle-switch"] div').eq(0).click({force:true,multiple:true})
    
      cy.get('div[data-testid="theme-toggle-switch"]').click()

      cy.get('svg[viewBox="0 0 12 12"]').should('be.visible')
   }

  })
})

Cypress.Commands.add('ClickForDescSorting',(name) => {

  let pos = 0
  blotterPage.getAllTradeTableHeader().each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == name) {
      pos = index + 2
      cy.wrap(pos).as('currentPosition')
      if (el.text() == "Trade ID" || el.text() == "Trade Date" || el.text() == "Value Date") {
        el.click()
      }
      else {
        el.click()
        el.click()
      }
      return false;
    }
  })

})

Cypress.Commands.add('ClickForAscSorting',(name) => {

  let pos = 0
  blotterPage.getAllTradeTableHeader().each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == name) {
      pos = index + 2
      cy.wrap(pos).as('currentPosition')
      if (el.text() == "Trade ID" || el.text() == "Trade Date" || el.text() == "Value Date") {
        el.click()
        el.click()
      }
      else {
        
        el.click()
      }
      return false;
    }
  })

})

Cypress.Commands.add('VerifyDescSortOnTrade', (name) => {
  let pos = 0;
  cy.get('@currentPosition').then( position => {
  pos = position
  })
  
  let d =''

  // cy.get('caption[id=trades-table-heading]+thead th:nth-child(2) div:contains("'+name+'")').should('be.visible').click()
  // blotterPage.getAllTradeTableHeader().each((el, index, list) => {
  //   //     cy.log('hello' +el.text()+" " +name)
  //   if (el.text() == name) {
  //     pos = index + 2
  //     if (el.text() == "Trade ID" || el.text() == "Trade Date" || el.text() == "Value Date") {
  //       el.click()
  //     }
  //     else {
  //       el.click()
  //       el.click()
  //     }
  //     return false;
  //   }
  // })

  cy.log("").then(() => {
    cy.log("pos " + pos)
    let prev;
    blotterPage.getOneTradeTableData(pos).eq(0).then((el) => {
      
      prev = el.text()
    })
    cy.log("").then(() => {
      blotterPage.getOneTradeTableData(pos).each((el, index1, list) => {

        if (name == "Trade Date" || name == "Value Date") {
          const dayjs = require('dayjs')
          d = dayjs(el.text()).format('YYYY-MM-DD')
          prev = d
        }
       
         else {
          d = el.text()
        }
        switch (name) {
          case 'Notional':
          case 'Trade ID':
          case 'Rate':
          case 'Trade Date':
          case 'Value Date':    
          if (index1 < 5) {
            cy.log("current values " + d + "prev " + prev)
            //    cy.log("equals "+ Number(d.replace(/[,-]/g,''))+"  "+Number(value.replace(/[,-]/g,'')))
            if (Number(d.replace(/[,-]/g, '')) > Number(prev.replace(/[,-]/g, ''))) {
              cy.log("list is not in Descneding sort order")
              expect("list should be in Desc order").to.eq("list not in Desc order")
              return false;
            }
            else {
              prev = el.text()
            }
          }
          if (index1 == 5) {
            expect("list is in Desc order").to.eq("list is in Desc order")
            return false;
          }
  
  
            break;
  
          default:
            if (index1 < 5) {
              cy.log("current values " + el.text() + "prev " + prev)
           
              if (el.text() > prev ) {
                cy.log("list is not in Descneding sort order")
                expect("list should be in Desc order").to.eq("list not in Desc order")
                return false;
              }
              else {
                prev = el.text()
              }
            }
            if (index1 == 5) {
              expect("list is in Desc order").to.eq("list is in Desc order")
              return false;
            }
  
  
            break;
  
        
        }
       
  
      })
    })
  })
})

Cypress.Commands.add('VerifyAscSortOnTrade', (name) => {

  
  let pos = 0
  cy.get('@currentPosition').then( position => {
    pos = position
    })
    
  let d =''

  // cy.get('caption[id=trades-table-heading]+thead th:nth-child(2) div:contains("'+name+'")').should('be.visible').click()
  // blotterPage.getAllTradeTableHeader().each((el, index, list) => {
  //   if (el.text() == name) {
  //     pos = index + 2
  //     if (el.text() == "Trade ID" || el.text() == "Trade Date" || el.text() == "Value Date") {
  //       el.click()
  //       el.click()
  //     }
  //     else {
  //       el.click()
  //     }
  //     return false;
  //   }
  // })

  cy.log("").then(() => {
    cy.log("pos " + pos)
    let prev;
    blotterPage.getOneTradeTableData(pos).eq(0).then((el) => {
      
      prev = el.text()
    })
    cy.log("").then(() => {
      blotterPage.getOneTradeTableData(pos).each((el, index1, list) => {

        if (name == "Trade Date" || name == "Value Date") {
          const dayjs = require('dayjs')
          d = dayjs(el.text()).format('YYYY-MM-DD')
          prev = d
        }
       
         else {
          d = el.text()
        }
        switch (name) {
          case 'Notional':
          case 'Trade ID':
          case 'Rate':
          case 'Trade Date':
          case 'Value Date':    
          if (index1 < 5) {
            cy.log("current values " + d + "prev " + prev)
            //    cy.log("equals "+ Number(d.replace(/[,-]/g,''))+"  "+Number(value.replace(/[,-]/g,'')))
            if (Number(d.replace(/[,-]/g, '')) < Number(prev.replace(/[,-]/g, ''))) {
              cy.log("list is not in Ascending sort order")
              expect("list should be in Asc order").to.eq("list not in Asc order")
              return false;
            }
            else {
              prev = el.text()
            }
          }
          if (index1 == 5) {
            expect("list is in Asc order").to.eq("list is in Asc order")
            return false;
          }
  
  
            break;
  
          default:
            if (index1 < 5) {
              cy.log("current values " + el.text() + "prev " + prev)
           
              if (el.text() < prev ) {
                cy.log("list is not in Ascending sort order")
                expect("list should be in Asc order").to.eq("list not in Asc order")
                return false;
              }
              else {
                prev = el.text()
              }
            }
            if (index1 == 5) {
              expect("list is in Asc order").to.eq("list is in Asc order")
              return false;
            }
  
  
            break;
  
        
        }
       
  
      })
    })
  })
})

Cypress.Commands.add('VerifyCheckboxSearchOnTrade', (header, value, search = null) => {

  
  let pos = 0

  // cy.get('caption[id=trades-table-heading]+thead th:nth-child(2) div:contains("'+name+'")').should('be.visible').click()
  blotterPage.getAllTradeTableHeader().each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == header) {
      pos = index + 2

      blotterPage.getOneTableHeader(pos).trigger('mouseover')
      blotterPage.getCheckboxFilterIcon(pos).click({ force: true, multiple: true })

      return false;
    }
  })

  cy.log(value).then(() => {

    blotterPage.getListOfSearchCriteria(pos).each((el1, index1, list) => {
      let flag = true;
      if (el1.text() == value) {
        if (search != null) {
          blotterPage.getSearchFieldUnderDropDown(pos).clear().type(value)
          blotterPage.getOneTableHeader(pos).eq(0).click({ force: true })
        }
        else {

          el1.click();
          blotterPage.getOneTableHeader(pos).eq(0).click({ force: true })

        }
        blotterPage.getOneTradeTableData(pos).each((el, index1, list) => {
          if (el.text() != value) {
            flag = false;
         
            expect("filter should happen correctly").to.eq("filter did not happen correctly")

            return false;
          }
        })
        if (flag == true) {
 
          expect("filter worked fine").to.eq("filter worked fine")
          return false;
        }
      }




    })
  })

})

Cypress.Commands.add('verifyCheckboxSearchforNumbers', (header, condition, value) => {

  let listingCount = 0
  let pos = 0


  blotterPage.getAllTradeTableHeader().each((el, index, list) => {
    if (el.text() == header) {
      pos = index + 2

      blotterPage.getOneTableHeader(pos).trigger('mouseover')
      blotterPage.getCheckboxFilterIcon(pos).click({ force: true, multiple: true })

      return false;
    }
  })

  cy.log(value).then(() => {
    blotterPage.getSelectOptionForCheckBox(pos).select(condition)

    let flag = true;
    let d = '';

    blotterPage.getSearchFieldUnderDropDown(pos).clear({ force: true }).type(value, { force: true })
    blotterPage.getOneTableHeader(pos).eq(0).click({ force: true })

    blotterPage.getOneTradeTableData(pos).each((el, index1, list) => {

      if (header == "Trade Date" || header == "Value Date") {
        const dayjs = require('dayjs')
        d = dayjs(el.text()).format('YYYY-MM-DD')
      }
      else {
        d = el.text()
      }
      switch (condition) {
        case 'Equals':

          //    cy.log("equals "+ Number(d.replace(/[,-]/g,''))+"  "+Number(value.replace(/[,-]/g,'')))
          if (Number(d.replace(/[,-]/g, '')) != Number(value.replace(/[,-]/g, ''))) {

            flag = false;

            cy.log('').then(() => { expect("filter should happen correctly").to.eq("filter did not happen correctly") })

            return false;
          }


          break;

        case 'Less than':
          if (Number(d.replace(/[,-]/g, '')) >= Number(value.replace(/[,-]/g, ''))) {
            flag = false;

            expect("filter should happen correctly").to.eq("filter did not happen correctly")

            return false;
          }


          break;

        case 'Greater than':
          if (Number(d.replace(/[,-]/g, '')) <= Number(value.replace(/[,-]/g, ''))) {
            flag = false;

            expect("filter should happen correctly").to.eq("filter did not happen correctly")

            return false;
          }


          break;
      }
    })

    if (flag == true) {

      expect("filter worked fine").to.eq("filter worked fine")
      return false;
    }






  })

})

//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
