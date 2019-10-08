import { ElementFinder, ExpectedConditions as EC, ProtractorBrowser } from 'protractor'
import { MainPage } from '../pages/main.page'
import { getBrowser } from '../browser-manager'
import { waitForElementToBeClickable, waitForElementToBeVisible } from './browser.utils'
import { wait } from './async.utils'
import { TileComponent } from '../pages/tile.component'

let mainPage: MainPage
let browser: ProtractorBrowser

export async function confirmationMessageAsserts(currencies, transaction, expectedResult, notional) {
    const browser = await getBrowser()
    const mainPage = new MainPage(browser)
    var tradeWord = ''
    var parsedTradeText = ''
    const currency = currencies.slice(0,3)
    const tradeSuccessMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage
    await waitForElementToBeVisible(browser, tradeSuccessMessage)
    const tradeSuccessString = await tradeSuccessMessage.getText()

    // Main trade message
    if(transaction == 'buy'){
        parsedTradeText = (await tradeSuccessMessage.getText()).slice(0,14)
        tradeWord = 'bought'
    }
    else{
        parsedTradeText = (await tradeSuccessMessage.getText()).slice(0,12)
        tradeWord = 'sold'
    }
    if(expectedResult == 'Success'){
        expect(parsedTradeText).toEqual(`You ${tradeWord} ${currency}`)
    }
    else {
        expect(await tradeSuccessMessage.getText()).toEqual('Your trade has been rejected')
    }
    
    
    // Displayed currency
    const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency

    if (!tradeCurrency) {
        throw new Error(`could not find element with symbol ${tradeCurrency}$`)
    }
    const displayedCurrency = await tradeCurrency.getText()
    expect(displayedCurrency).toEqual(currencies)
    

    //Trade ID
    const tradeIdActual = await mainPage.tile.tradeType.confirmationScreen.labelTradeId
    if (!tradeIdActual) {
        throw new Error(`could not find element with symbol ${tradeIdActual}$`)
    }
    const parsedTradeId = (await tradeIdActual.getText()).slice(10,14)
    if (!parsedTradeId) {
        throw new Error(`could not find element with symbol ${parsedTradeId}$`)
    }
    const tradeIdExpected = await mainPage.blotter.tradesTable.executedTrades.tradeID
    if (!tradeIdExpected) {
        throw new Error(`could not find element with symbol ${tradeIdExpected}$`)
    }
    expect(tradeIdExpected.getText()).toEqual(parsedTradeId)

    //Banner color
    const tradeSuccessBanner = await mainPage.blotter.tradesTable.executedTrades.tradeBackGroundColour
    if(expectedResult == 'Success'){
        expect(tradeSuccessBanner.getCssValue('background-color')).toEqual('rgba(40, 201, 136, 1)')
    }
    else{
        expect(tradeSuccessBanner.getCssValue('background-color')).toEqual('rgba(249, 76, 76, 1)')
    }

    //Notional value
    if(expectedResult == 'Success'){   
        var regularExpression = new RegExp('(?<=You '+tradeWord+' '+currency+' )(\\d{1,3}(,\\d{1,3})?(,\\d{1,3})?(,\\d{1,3})?)+(\\.\\d{2})?')
        var confirmationNotional = tradeSuccessString.match(regularExpression)[0]
        expect(notional).toEqual(confirmationNotional)  
    }

// Close the confirmation screen
await mainPage.tile.tradeType.confirmationScreen.pillButton.click()
//wait for the confirmation screen to close
await wait(5000)


}

export async function assertDisplayedCurrencies(expectedCurrencies) {
    let allCurrencies = ['EUR/USD', 'USD/JPY', 'GBP/USD', 'GBP/JPY', 'AUD/USD', 'NZD/USD', 'EUR/AUD', 'EUR/CAD', 'EUR/JPY']
    for (let i in allCurrencies){
        var convertedCurrency = allCurrencies[i].replace(/\//ig, "To")

        if (expectedCurrencies.includes(i)){
            const tradeCurrency = await mainPage.tile.tradeType[convertedCurrency].labelCurrency
            const displayedCurrency = await tradeCurrency.getText()
            expect(displayedCurrency).toEqual(allCurrencies[i])
        }

    }
}