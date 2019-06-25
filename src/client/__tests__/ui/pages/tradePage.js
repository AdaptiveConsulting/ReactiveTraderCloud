'use strict'

const TradePage = Object.create({}, {

  // Live rates Component locators
  labelLiveRates: {
    get() {
      return browser.element(by.css('.styled__LiStyle-bh08f7-2.styled__LeftNavItemFirst-bh08f7-3.hwNYKP'))
    }
  },
  linkAll: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.dDGSrG')).get(0)
    }
  },
  linkEUR: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.hFhFum')).get(0)
    }
  },
  linkUSD: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.hFhFum')).get(1)
    }
  },
  linkGBP: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.hFhFum')).get(2)
    }
  },
  linkAUD: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.hFhFum')).get(3)
    }
  },
  linkNZD: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.hFhFum')).get(4)
    }
  },
  linkTableView: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.dDGSrG')).get(1)
    }
  },
  linkGraphView: {
    get() {
      return browser.element.all(by.css('.styled__LiStyle-bh08f7-2.styled__NavItem-bh08f7-4.hFhFum')).get(5)
    }
  },
  buttonSellFirstCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(0)
    }
  },
  buttonBuyFirstCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(1)
    }
  },
  labelCurrencyFirstCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(0)
    }
  },
  textAmountFirstCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(0)
    }
  },
  buttonDetachFirstCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(0)
    }
  },
  buttonSellSecondCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(2)
    }
  },
  buttonBuySecondCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(3)
    }
  },
  labelCurrencySecondCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(1)
    }
  },
  textAmountSecondCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(1)
    }
  },
  buttonDetachSecondCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(1)
    }
  },
  buttonSellThirdCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(4)
    }
  },
  buttonBuyThirdCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(5)
    }
  },
  labelCurrencyThirdCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(2)
    }
  },
  textAmountThirdCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(2)
    }
  },
  buttonDetachThirdCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(2)
    }
  },
  buttonSellFourthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(6)
    }
  },
  buttonBuyFourthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(7)
    }
  },
  labelCurrencyFourthCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(3)
    }
  },
  textAmountFourthCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(3)
    }
  },
  buttonDetachFourthCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(3)
    }
  },
  buttonSellFifthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(8)
    }
  },
  buttonBuyFifthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(9)
    }
  },
  labelCurrencyFifthCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(4)
    }
  },
  textAmountFifthCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(4)
    }
  },
  buttonDetachFifthCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(4)
    }
  },
  buttonSellSixthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(10)
    }
  },
  buttonBuySixthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(11)
    }
  },
  labelCurrencySixthCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(5)
    }
  },
  textAmountSixthCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(5)
    }
  },
  buttonDetachSixthCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(5)
    }
  },
  buttonSellSeventhCell: {
    get() {
      return browser.element.all(by.css('div.styled__PriceButtonDisabledPlaceholder-sc-1vddl31-1.gdGMKs')).get(0)
    }
  },
  buttonBuySeventhCell: {
    get() {
      return browser.element.all(by.css('div.styled__PriceButtonDisabledPlaceholder-sc-1vddl31-1.gdGMKs')).get(1)
    }
  },
  buttonInitiateRFQ: {
    get() {
      return browser.element(by.css('span.TileBooking__BookingStatus-b4jprv-2.jxSENf'))
    }
  },
  labelCurrencySeventhCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(6)
    }
  },
  textAmountSeventhCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(6)
    }
  },
  buttonRedoSeventhCell: {
    get() {
      return browser.element(by.css('.fas.fa-redo.fa-flip-horizontal'))
    }
  },
  buttonDetachSeventhCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(6)
    }
  },
  buttonSellEigthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(12)
    }
  },
  buttonBuyEigthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(13)
    }
  },
  labelCurrencyEigthCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(7)
    }
  },
  textAmountEigthCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(7)
    }
  },
  buttonDetachEigthCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(7)
    }
  },
  buttonSellNinthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(14)
    }
  },
  buttonBuyNinthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(15)
    }
  },
  labelCurrencyNinthCell: {
    get() {
      return browser.element.all(by.css('span.styled__CurrencyPairSymbol-wn8bkr-0.evWWeD')).get(8)
    }
  },
  textAmountNinthCell: {
    get() {
      return browser.element.all(by.css('input.styled__Input-wn8bkr-3.IGows')).get(8)
    }
  },
  buttonDetachNinthCell: {
    get() {
      return browser.element(by.css('.TileControls__TopRightButton-sc-3ej1f5-0.eWqAno > svg')).get(8)
    }
  },
  tradeRejectedMessage: {
    get() {
      return browser.element(by.css('div.TileNotification__Content-sc-19yw4wf-5.jIfHZr'))
    }
  },
  buttonCloseTradeRejected: {
    get() {
      return browser.element(by.css('div.styled__TileBaseStyle-sc-6mxq7t-2.TileNotification__TileNotificationStyle-sc-19yw4wf-0.eCcGTf > button'))
    }
  },
  tradeExecutionTimeOutMessage: {
    get() {
      return browser.element(by.css('.TileNotification__Content-sc-19yw4wf-5'))
    }
  },
  tradeSuccessMessage: {
    get() {
      return browser.element(by.css('div.styled__TileBaseStyle-sc-6mxq7t-2.TileNotification__TileNotificationStyle-sc-19yw4wf-0.bPQmtX > div.TileNotification__Content-sc-19yw4wf-5.jIfHZr'))
    }
  },
  buttonCloseTradeSuccess: {
    get() {
      return browser.element(by.css('div.styled__TileBaseStyle-sc-6mxq7t-2.TileNotification__TileNotificationStyle-sc-19yw4wf-0.bPQmtX > button'))
    }
  },
  // Executed Trades Component locators
  labelExecutedTrades: {
    get() {
      return browser.element(by.css('div.BlotterHeader__BlotterLeft-sc-1bvhiat-3.euXKsm'))
    }
  },
  textBackGroundColour: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[1]'))
    }
  },
  textTradeId: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[2]'))
    }
  },
  textTradeStatus: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[3]'))
    }
  },
  textTradeDate: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[4]/span'))
    }
  },
  textTradeDirection: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[5]'))
    }
  },
  textTradeCCYToCCY: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[6]'))
    }
  },
  textTradeDealtCCY: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[7]'))
    }
  },
  textTradeNotional: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[8]/span'))
    }
  },
  textTradeRate: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[9]'))
    }
  },
  textTradeValueDate: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[10]/span'))
    }
  },
  textTraderName: {
    get() {
      return browser.element(by.xpath('//*[@id="root"]/div/div[2]/div/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div[3]/div[2]/div/div/div[1]/div[11]'))
    }
  },
  ButtonExportCsv: {
    get() {
      return browser.element(by.css('.ExcelButton__Button-ouhco0-0.hxONBK > svg'))
    }
  },
  textFieldFilter: {
    get() {
      return browser.element(by.css('input.QuickFilter__QuickFilterInput-sc-1y8fby7-1.ccuwiU'))
    }
  },
  ButtonCloseFilter: {
    get() {
      return browser.element(by.css('.fas.fa-times'))
    }
  }
})

module.exports = TradePage
