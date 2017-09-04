const trades = [
  {
    "tradeId": 1610,
    "traderName": "RNI",
    "currencyPair": {
      "symbol": "EURAUD",
      "ratePrecision": 5,
      "pipsPosition": 4,
      "base": "EUR",
      "terms": "AUD",
      "displayString": "EUR/AUD"
    },
    "notional": 1000000,
    "dealtCurrency": "AUD",
    "direction": "SELL",
    "spotRate": 1.50382,
    "tradeDate": "2017-07-25T15:30:36.147Z",
    "valueDate": "2017-07-27T00:00:00.000Z",
    "status": "Done"
  },
  {
    "tradeId": 1378,
    "traderName": "DGR",
    "currencyPair": {
      "symbol": "GBPJPY",
      "ratePrecision": 3,
      "pipsPosition": 2,
      "base": "GBP",
      "terms": "JPY"
    },
    "notional": 1000000,
    "dealtCurrency": "GBP",
    "direction": "Sell",
    "spotRate": 184.576,
    "tradeDate": "2017-09-04T10:12:58.849Z",
    "valueDate": "2017-09-06T00:00:00.000Z",
    "status": "rejected"
  },
  {
    "tradeId": 1379,
    "traderName": "DGR",
    "currencyPair": {
      "symbol": "USDJPY",
      "ratePrecision": 3,
      "pipsPosition": 2,
      "base": "USD",
      "terms": "JPY"
    },
    "notional": 1000000,
    "dealtCurrency": "USD",
    "direction": "Buy",
    "spotRate": 121.582,
    "tradeDate": "2017-09-04T10:12:59.941Z",
    "valueDate": "2017-09-06T00:00:00.000Z",
    "status": "done"
  },
  {
    "tradeId": 1380,
    "traderName": "DGR",
    "currencyPair": {
      "symbol": "GBPUSD",
      "ratePrecision": 5,
      "pipsPosition": 4,
      "base": "GBP",
      "terms": "USD"
    },
    "notional": 1000000,
    "dealtCurrency": "GBP",
    "direction": "Sell",
    "spotRate": 1.51558,
    "tradeDate": "2017-09-04T10:13:02.155Z",
    "valueDate": "2017-09-06T00:00:00.000Z",
    "status": "done"
  },
  {
    "tradeId": 1381,
    "traderName": "DGR",
    "currencyPair": {
      "symbol": "EURUSD",
      "ratePrecision": 5,
      "pipsPosition": 4,
      "base": "EUR",
      "terms": "USD"
    },
    "notional": 1000000,
    "dealtCurrency": "EUR",
    "direction": "Buy",
    "spotRate": 1.09365,
    "tradeDate": "2017-09-04T10:13:04.276Z",
    "valueDate": "2017-09-06T00:00:00.000Z",
    "status": "done"
  },
  {
    "tradeId": 1382,
    "traderName": "DGR",
    "currencyPair": {
      "symbol": "EURAUD",
      "ratePrecision": 5,
      "pipsPosition": 4,
      "base": "EUR",
      "terms": "AUD"
    },
    "notional": 1000000,
    "dealtCurrency": "EUR",
    "direction": "Sell",
    "spotRate": 1.5011,
    "tradeDate": "2017-09-04T10:13:06.412Z",
    "valueDate": "2017-09-06T00:00:00.000Z",
    "status": "done"
  },
  {
    "tradeId": 1383,
    "traderName": "DGR",
    "currencyPair": {
      "symbol": "GBPUSD",
      "ratePrecision": 5,
      "pipsPosition": 4,
      "base": "GBP",
      "terms": "USD"
    },
    "notional": 1000000,
    "dealtCurrency": "GBP",
    "direction": "Buy",
    "spotRate": 1.51602,
    "tradeDate": "2017-09-04T10:17:47.344Z",
    "valueDate": "2017-09-06T00:00:00.000Z",
    "status": "done"
  }
]

// convert stringified dates to date format
trades.forEach((item: any) => {
  item.tradeDate = new Date(item.tradeDate)
})
trades.forEach((item: any) => {
  item.valueDate = new Date(item.valueDate)
})

trades.sort(() => 0.5 - Math.random())

const blotterProps = {
  trades,
  onPopoutClick: () => {
  },
  isConnected: true,
  canPopout: false,
  size: {
    width: 900,
    height: 200
  }
}

export default blotterProps
