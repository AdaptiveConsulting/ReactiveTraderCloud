import { Direction } from 'rt-types'
import { SpotTileData } from '../../model/index'
import { PriceMovementTypes } from '../../model/priceMovementTypes'

const currencyPair = {
  base: 'EUR',
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: 'EURUSD',
  terms: 'USD',
}

const spotTileData: Required<SpotTileData> = {
  currencyChartIsOpening: false,
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

export { currencyPair, spotTileData, tradeExecuted, tradeRejected }
