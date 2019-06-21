'use strict'

const TradePage = Object.create({}, {

  // Live rates Component locators
  labelLiveRates: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(1)'))
    }
  },
  linkAll: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(2)'))
    }
  },
  linkGBP: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(3)'))
    }
  },
  linkEUR: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(4)'))
    }
  },
  linkUSD: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(5)'))
    }
  },
  linkAUD: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(6)'))
    }
  },
  linkNZD: {
    get() {
      return browser.element(by.css('ul.styled__LeftNav-bh08f7-1.hvbpaO > li:nth-child(7)'))
    }
  },
  linkTableView: {
    get() {
      return browser.element(by.css('ul.styled__RightNav-bh08f7-5.jlLWgn> li:nth-child(1)'))
    }
  },
  linkGraphView: {
    get() {
      return browser.element(by.css('ul.styled__RightNav-bh08f7-5.jlLWgn> li:nth-child(2)'))
    }
  },
  buttonsellFirstCell: {
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
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountFirstCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div > input'))
    }
  },
  buttonDetachFirstCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(2) > div > div > button > svg'))
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
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountSecondCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > input'))
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
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(3) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountThirdCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(3) > div > div > div > div:nth-child(2) > div > div > input'))
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
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(4) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountFourthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(4) > div > div > div > div:nth-child(2) > div > div > input'))
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
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(5) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountFifthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(5) > div > div > div > div:nth-child(2) > div > div > input'))
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
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(6) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountSixthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(6) > div > div > div > div:nth-child(2) > div > div > input'))
    }
  },
  buttonSellSeventhCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(12)
    }
  },
  buttonBuySeventhCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(13)
    }
  },
  labelCurrencySeventhCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(7) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountSeventhCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(7) > div > div > div > div:nth-child(2) > div > div > input'))
    }
  },
  buttonSellEigthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(14)
    }
  },
  buttonBuyEigthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(15)
    }
  },
  labelCurrencyEigthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(8) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountEigthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(8) > div > div > div > div:nth-child(2) > div > div > input'))
    }
  },
  buttonSellNinthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(16)
    }
  },
  buttonBuyNinthCell: {
    get() {
      return browser.element.all(by.css('div.styled__Box-m2h9d2-1.styled__Pip-m2h9d2-4.fnESnJ')).get(17)
    }
  },
  labelCurrencyNinthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(9) > div > div > div > div:nth-child(2) > div > div > span'))
    }
  },
  textAmountNinthCell: {
    get() {
      return browser.element(by.css('div.Workspace__WorkspaceItems-sc-1tjnnjx-0.ciZxfB > div:nth-child(9) > div > div > div > div:nth-child(2) > div > div > input'))
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
      return browser.element(by.css('div.BlotterHeader__BlotterRight-sc-1bvhiat-2.hfEwxw > button.ExcelButton__Button-ouhco0-0.hxONBK > svg'))
    }
  },
  textFieldFilter: {
    get() {
      return browser.element(by.css('div.BlotterToolbar__BlotterToolbarStyle-sc-18kcelw-0.jhZpzs > div > input'))
    }
  },
  ButtonCloseFilter: {
    get() {
      return browser.element(by.css('div.BlotterHeader__BlotterRight-sc-1bvhiat-2.hfEwxw > div.BlotterToolbar__BlotterToolbarStyle-sc-18kcelw-0.jhZpzs > div > i > i'))
    }
  }
})

module.exports = TradePage
