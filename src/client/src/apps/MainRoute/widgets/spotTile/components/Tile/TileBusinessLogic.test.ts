import {
  getNumericNotional,
  isValueInRfqRange,
  isValueOverRfqRange,
  isInvalidTradingValue,
  isEditMode,
  DerivedStateFromUserInput,
  getDerivedStateFromUserInput,
  getFormattedValue,
  getDefaultNotionalValue,
  getDerivedStateFromProps,
} from './TileBusinessLogic'
import { TileProps, TileState } from './Tile'
import { TradingMode } from '../types'
import { PriceMovementTypes } from '../../model/priceMovementTypes'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { TileViews } from '../../../workspace/workspaceHeader/index'

// edit mode, should not format on the fly
// https://regex101.com/r/MrSCRE/4
// Leave commented values to easily compare
const shouldNotFormatOnTheFly = [
  // '000',
  // '00',
  // ',',
  '',
  '.',
  '0',
  '0.1',
  '0.4',
  // '2.82',
  // '12.87',
  '4.5',
  '5.',
  '.6',
  '12.',
  // '34.56',
  '34,876.',
  '34,876.8',
  // '34,876.89',
  // '6.78',
  // '103,234,876',
  // '100,000,000',
  // '123456',
  // '123 456',
  '0.0',
  ',000,000',
  '00,000,000',
  // '0.00',
  // '.98765',
  // '.05',
  // '.11',
  // '0.11',
  // 'Infinity',
  // 'NaN',
  // '01234'
]
// should format on the fly
const shouldFormatOnTheFly = [
  '000',
  '00',
  ',',
  // '',
  // '.',
  // '0',
  // '0.1',
  // '0.4',
  '2.82',
  '12.87',
  // '4.5',
  // '5.',
  // '.6',
  // '12.',
  '34.56',
  // '34,876.',
  // '34,876.8',
  '34,876.89',
  '6.78',
  '103,234,876',
  '100,000,000',
  '123456',
  '123 456',
  // '0.0',
  // ',000,000',
  // '00,000,000',
  '0.00',
  '.98765',
  '.05',
  '.11',
  '0.11',
  'Infinity',
  'NaN',
  '01234',
]

test('isEditMode should be true', () => {
  shouldNotFormatOnTheFly.forEach(v => {
    console.log('shouldNotFormatOnTheFly', v)
    expect(isEditMode(v)).toBe(true)
  })
})

test('isEditMode should be false', () => {
  shouldFormatOnTheFly.forEach(v => {
    console.log('shouldFormatOnTheFly', v)
    expect(isEditMode(v)).toBe(false)
  })
})

// invalid trading values, should disable trading (Buy/Sell buttons)
// https://regex101.com/r/OWDRCO/2
// Leave commented values to easily compare
const invalidTradingValues = [
  '.',
  ',',
  '0',
  '0.0',
  // '0.2',
  // '0.1',
  // '0.01',
  // '0.98',
  '0.00',
  // '0.01',
  // '34,134.',
  // '34,134.7',
  // '34,134.65',
  '000,000',
  '01,000',
  // '1.1',
  // '1',
  // '1.98',
  ',000',
  // '12,123,123',
  'Infinity',
  'NaN',
  '0',
  // '.76',
  '',
]
// valid trading values, should enable trading (Buy/Sell buttons)
const validTradingValues = [
  // '.',
  // ',',
  // '0',
  // '0.0',
  '0.2',
  '0.1',
  '0.01',
  '0.98',
  // '0.00',
  '0.01',
  '34,134.',
  '34,134.7',
  '34,134.65',
  // '000,000',
  // '01,000',
  '1.1',
  '1',
  '1.98',
  // ',000',
  '12,123,123',
  // 'Infinity',
  // 'NaN',
  // '0',
  '.76',
  // ''
]

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

test('getNumericNotional', () => {
  const numericValue = getNumericNotional('1,000,000')
  expect(numericValue).toBe(1000000)

  const numericValue2 = getNumericNotional('1,000.00')
  expect(numericValue2).toBe(1000)

  const numericValue3 = getNumericNotional('7800')
  expect(numericValue3).toBe(7800)

  const numericValue4 = getNumericNotional(1200 as any)
  expect(numericValue4).toBe(1200)
})

test('isValueInRfqRange', () => {
  const isInRange = isValueInRfqRange('1,000,000')
  expect(isInRange).toBe(false)

  const isInRange2 = isValueInRfqRange('10,000,000')
  expect(isInRange2).toBe(true)

  const isInRange3 = isValueInRfqRange('999,999,999.99')
  expect(isInRange3).toBe(true)

  const isInRange4 = isValueInRfqRange('1,000,000,000')
  expect(isInRange4).toBe(true)

  const isInRange5 = isValueInRfqRange('1,000,000,001')
  expect(isInRange5).toBe(false)
})

test('isValueOverRfqRange', () => {
  const isOverRange = isValueOverRfqRange('1,000,000')
  expect(isOverRange).toBe(false)

  const isOverRange2 = isValueOverRfqRange('10,000,000')
  expect(isOverRange2).toBe(false)

  const isOverRange3 = isValueOverRfqRange('999,999,999.99')
  expect(isOverRange3).toBe(false)

  const isOverRange4 = isValueOverRfqRange('1,000,000,000')
  expect(isOverRange4).toBe(false)

  const isOverRange5 = isValueOverRfqRange('1,000,000,001')
  expect(isOverRange5).toBe(true)
})

const prevState: TileState = {
  canExecute: true,
  inputDisabled: false,
  inputValidationMessage: null,
  notional: '1,000,000',
  tradingDisabled: false,
}

const currencyPair: CurrencyPair = {
  symbol: 'EURCAD',
  ratePrecision: 5,
  pipsPosition: 4,
  base: 'EUR',
  terms: 'CAD',
}

const defaultParams: DerivedStateFromUserInput = {
  actions: {
    setTradingMode: (tradingMode: TradingMode) => {},
  },
  prevState,
  notionalUpdate: {
    updateType: 'blur',
    value: '1,000,000',
  },
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
  },
  currencyPair,
}

const defaultNewState: TileState = {
  canExecute: true,
  inputDisabled: false,
  inputValidationMessage: null,
  notional: '1,000,000',
  tradingDisabled: false,
}

test('state derived from user interaction on change when isInvalidTradingValue is false', () => {
  validTradingValues.forEach(value => {
    const newParams = {
      ...defaultParams,
      notionalUpdate: {
        updateType: 'change',
        value,
      },
    }
    const newState = getDerivedStateFromUserInput(newParams)
    const expected = {
      ...defaultNewState,
      notional: isEditMode(value) ? value : getFormattedValue(value),
      tradingDisabled: isValueInRfqRange(value) || isValueOverRfqRange(value),
    }
    console.log('validating state on change validTradingValues', value)
    expect(newState).toEqual(expected)
  })
})

test('state derived from user interaction on blur when isInvalidTradingValue is false', () => {
  validTradingValues.forEach(value => {
    const newParams = {
      ...defaultParams,
      notionalUpdate: {
        updateType: 'blur',
        value,
      },
    }
    const newState = getDerivedStateFromUserInput(newParams)
    const expected = {
      ...defaultNewState,
      notional: getFormattedValue(value), // onBlur always formated value
      tradingDisabled: isValueInRfqRange(value) || isValueOverRfqRange(value),
    }
    console.log('validating state on blur validTradingValues', value)
    expect(newState).toEqual(expected)
  })
})

test('state derived from user interaction on change when isInvalidTradingValue is true', () => {
  invalidTradingValues.forEach(value => {
    const newParams = {
      ...defaultParams,
      notionalUpdate: {
        updateType: 'change',
        value,
      },
    }
    const newState = getDerivedStateFromUserInput(newParams)
    const expected = {
      ...defaultNewState,
      notional: isEditMode(value) ? value : getFormattedValue(value),
      tradingDisabled: true,
    }
    console.log('validating state on change invalidTradingValues', value)
    expect(newState).toEqual(expected)
  })
})

test('state derived from user interaction on blur when isInvalidTradingValue is true', () => {
  invalidTradingValues.forEach(value => {
    const newParams = {
      ...defaultParams,
      notionalUpdate: {
        updateType: 'blur',
        value,
      },
    }
    const newState = getDerivedStateFromUserInput(newParams)
    const expected = {
      ...defaultNewState,
      notional: getDefaultNotionalValue(currencyPair), // Something not NZDUSD
      tradingDisabled: false, // Since it resets, set false
    }
    console.log('validating state on blur invalidTradingValues', value)
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

test('state derived from props, trading disabled', () => {
  const state: TileState = {
    ...prevState,
    tradingDisabled: true,
  }
  const newState: TileState = getDerivedStateFromProps(defaultTileProps, state)
  const expected = {
    ...state,
    canExecute: false,
  }
  expect(newState).toEqual(expected)
})
