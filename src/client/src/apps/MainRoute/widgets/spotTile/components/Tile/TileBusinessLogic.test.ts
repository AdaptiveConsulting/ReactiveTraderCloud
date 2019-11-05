import {
  isValueInRfqRange,
  isValueOverRfqRange,
  isInvalidTradingValue,
  getDerivedStateFromUserInput,
  getDerivedStateFromProps,
} from './TileBusinessLogic'
import { TileProps, TileState } from './Tile'
import { TradingMode } from '../types'
import { PriceMovementTypes } from '../../model/priceMovementTypes'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { TileViews } from '../../../workspace/workspaceHeader'

// invalid trading values, should disable trading (Buy/Sell buttons)
// https://regex101.com/r/OWDRCO/2
const invalidTradingValues = [0, -0, Infinity, -Infinity, NaN]
// valid trading values, should enable trading (Buy/Sell buttons)
const validTradingValues = [0.2, 0.01, 0.98, 34134, 34134.7, 34134.65]

test('isInvalidTradingValue should true', () => {
  invalidTradingValues.forEach(v => {
    console.log('invalidTradingValues', v)
    expect(isInvalidTradingValue(v)).toBe(true)
  })
})

test('isInvalidTradingValue should false', () => {
  validTradingValues.forEach(v => {
    console.log('validTradingValues', v)
    expect(isInvalidTradingValue(v)).toBe(false)
  })
})

test('isValueInRfqRange', () => {
  const isInRange = isValueInRfqRange(1000000)
  expect(isInRange).toBe(false)

  const isInRange2 = isValueInRfqRange(10000000)
  expect(isInRange2).toBe(true)

  const isInRange3 = isValueInRfqRange(999999999.99)
  expect(isInRange3).toBe(true)

  const isInRange4 = isValueInRfqRange(1000000000)
  expect(isInRange4).toBe(true)

  const isInRange5 = isValueInRfqRange(1000000001)
  expect(isInRange5).toBe(false)
})

test('isValueOverRfqRange', () => {
  const isOverRange = isValueOverRfqRange(1000000)
  expect(isOverRange).toBe(false)

  const isOverRange2 = isValueOverRfqRange(10000000)
  expect(isOverRange2).toBe(false)

  const isOverRange3 = isValueOverRfqRange(999999999.99)
  expect(isOverRange3).toBe(false)

  const isOverRange4 = isValueOverRfqRange(1000000000)
  expect(isOverRange4).toBe(false)

  const isOverRange5 = isValueOverRfqRange(1000000001)
  expect(isOverRange5).toBe(true)
})

const prevState: TileState = {
  canExecute: true,
  inputDisabled: false,
  inputValidationMessage: undefined,
}

const currencyPair: CurrencyPair = {
  symbol: 'EURCAD',
  ratePrecision: 5,
  pipsPosition: 4,
  base: 'EUR',
  terms: 'CAD',
}

const defaultParams: Parameters<typeof getDerivedStateFromUserInput>[0] = {
  actions: {
    setTradingMode: (tradingMode: TradingMode) => {},
  },
  prevState,
  spotTileData: {
    currencyChartIsOpening: false,
    historicPrices: [],
    isTradeExecutionInFlight: false,
    lastTradeExecutionStatus: null,
    price: {
      ask: 1.48364,
      bid: 1.4835,
      creationTimestamp: 694779224112175,
      mid: 1.48357,
      priceMovementType: 'Down' as PriceMovementTypes,
      symbol: 'EURCAD',
      valueDate: '2019-04-07T00:00:00Z',
    },
    rfqPrice: null,
    rfqState: 'none',
    rfqTimeout: null,
    rfqReceivedTime: null,
    notional: 1000000,
  },
  currencyPair,
}

const defaultNewState: TileState = {
  canExecute: true,
  inputDisabled: false,
  inputValidationMessage: undefined,
}

validTradingValues.forEach(value => {
  test(`state derived from notional ${value} (isInvalidTradingValue is false)`, () => {
    const newParams = {
      ...defaultParams,
      spotTileData: {
        ...defaultParams.spotTileData,
        notional: value,
      },
    }
    const newState = getDerivedStateFromUserInput(newParams)
    const expected = {
      ...defaultNewState,
    }
    expect(newState).toEqual(expected)
  })
})

const defaultTileProps: TileProps = {
  children: jest.fn(),
  currencyPair,
  executeTrade: () => {},
  setTradingMode: () => {},
  executionStatus: 'CONNECTED' as ServiceConnectionStatus,
  rfq: {
    cancel: () => {},
    expired: () => {},
    reject: () => {},
    request: () => {},
    requote: () => {},
    reset: () => {},
  },
  spotTileData: defaultParams.spotTileData,
  tileView: 'Normal' as TileViews,
  updateNotional: () => {},
}

test('state derived from props, defaults, RFQ none, should be able to excute', () => {
  const newState: TileState = getDerivedStateFromProps(defaultTileProps, prevState)
  const expected = {
    ...prevState,
  }
  expect(newState).toEqual(expected)
})

test('state derived from props, DISCONNECTED', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    executionStatus: 'DISCONNECTED' as ServiceConnectionStatus,
  }
  const newState: TileState = getDerivedStateFromProps(nextProps, prevState)
  const expected = {
    ...prevState,
    inputDisabled: true,
    canExecute: false,
  }
  expect(newState).toEqual(expected)
})

test('state derived from props, in trade', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      isTradeExecutionInFlight: true,
    },
  }
  const newState: TileState = getDerivedStateFromProps(nextProps, prevState)
  const expected = {
    ...prevState,
    inputDisabled: true,
    canExecute: false,
  }
  expect(newState).toEqual(expected)
})

test('state derived from props, RFQ requested', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'requested',
    },
  }
  const newState: TileState = getDerivedStateFromProps(nextProps, prevState)
  const expected = {
    ...prevState,
    inputDisabled: true,
    canExecute: false,
  }
  expect(newState).toEqual(expected)
})

test('state derived from props, RFQ received', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'received',
    },
  }
  const newState: TileState = getDerivedStateFromProps(nextProps, prevState)
  const expected = {
    ...prevState,
    inputDisabled: true,
  }
  expect(newState).toEqual(expected)
})

test('state derived from props, RFQ canRequest', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'canRequest',
    },
  }
  const newState: TileState = getDerivedStateFromProps(nextProps, prevState)
  const expected = {
    ...prevState,
    canExecute: false,
  }
  expect(newState).toEqual(expected)
})

test('state derived from props, RFQ expired', () => {
  const nextProps: TileProps = {
    ...defaultTileProps,
    spotTileData: {
      ...defaultTileProps.spotTileData,
      rfqState: 'expired',
    },
  }
  const newState: TileState = getDerivedStateFromProps(nextProps, prevState)
  const expected = {
    ...prevState,
    canExecute: false,
  }
  expect(newState).toEqual(expected)
})
