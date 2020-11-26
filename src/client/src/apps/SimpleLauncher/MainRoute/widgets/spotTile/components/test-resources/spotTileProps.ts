import { Direction } from 'rt-types'
import { SpotPriceTick, SpotTileData } from '../../model'
import { PriceMovementTypes } from '../../model/priceMovementTypes'

const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD',
}

const priceTick: SpotPriceTick = {
  ask: 12.5,
  bid: 14.0,
  mid: 13.0,
  creationTimestamp: 20052,
  symbol: 'EURCAD',
  valueDate: '2018-08-04T00:00:00Z',
  priceMovementType: PriceMovementTypes.Up,
  priceStale: true,
}
const generateHistoricPrices: (totalPricePrick: number) => SpotPriceTick[] = totalPricePrick => {
  const historicPrices = []
  for (let counter = 0; counter < totalPricePrick; counter++) {
    const mid = Math.random() * priceTick.mid
    const finalMid = Math.random() < 0.3 ? mid * -1 + 0.5 : mid
    historicPrices.push({ ...priceTick, mid: finalMid })
  }

  return historicPrices
}

const spotTileData: SpotTileData = {
  notional: 1000000,
  isTradeExecutionInFlight: false,
  price: {
    ask: 184.775,
    bid: 184.767,
    creationTimestamp: 31566750203189236,
    mid: 184.771,
    priceMovementType: PriceMovementTypes.Down,
    symbol: 'GBPJPY',
    valueDate: '2018-08-04T00:00:00Z',
  },
  historicPrices: generateHistoricPrices(20),
  rfqState: 'none',
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null,
  lastTradeExecutionStatus: null,
}

const trade = {
  tradeId: 4619,
  symbol: 'GBPJPY',
  traderName: 'ESP',
  notional: 1000000,
  dealtCurrency: 'GBP',
  direction: Direction.Buy,
  spotRate: 184.672,
  tradeDate: new Date('2018-08-09T16:34:52.622Z'),
  valueDate: new Date('2018-08-13T00:00:00.000Z'),
  status: 'rejected',
}

const lastTradeExecutionStatus = {
  hasError: false,
  request: {
    CurrencyPair: 'GBPJPY',
    SpotRate: 184.672,
    Direction: Direction.Buy,
    Notional: 1000000,
    DealtCurrency: 'GBP',
  },
}

const tradeExecuted = {
  ...lastTradeExecutionStatus,
  trade: { ...trade, status: 'done' },
}

const tradeRejected = {
  ...lastTradeExecutionStatus,
  trade: { ...trade, status: 'rejected' },
}

const spotTileDataWithRfq: SpotTileData = {
  notional: 100000000,
  isTradeExecutionInFlight: false,
  price: {
    ask: 184.775,
    bid: 184.767,
    creationTimestamp: 31566750203189236,
    mid: 184.771,
    priceMovementType: PriceMovementTypes.Up,
    symbol: 'GBPJPY',
    valueDate: '2018-08-04T00:00:00Z',
  },
  historicPrices: generateHistoricPrices(20),
  rfqState: 'none',
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null,
  lastTradeExecutionStatus: null,
}

const switchOptions = {
  canRequest: 'canRequest',
  requested: 'requested',
  expired: 'expired',
  none: 'none',
}

export {
  currencyPair,
  spotTileData,
  tradeExecuted,
  tradeRejected,
  trade,
  generateHistoricPrices,
  spotTileDataWithRfq,
  switchOptions,
}
