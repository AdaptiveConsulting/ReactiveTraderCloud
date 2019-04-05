import {
  getNumericNotional,
  isValueInRfqRange,
  isValueOverRfqRange,
  isInvalidTradingValue,
  isEditMode,
  DerivedStateFromUserInput,
  getDerivedStateFromUserInput,
} from './TileBusinessLogic'
import { TileState } from './Tile'
import { TradingMode } from '../types'
import { PriceMovementTypes } from '../../../../ui/spotTile/model/priceMovementTypes'

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

test('isInvalidTradingValue', () => {
  const isInvalid = isInvalidTradingValue('1')
  expect(isInvalid).toBe(false)

  const isInvalid2 = isInvalidTradingValue('0')
  expect(isInvalid2).toBe(true)

  const isInvalid3 = isInvalidTradingValue('.')
  expect(isInvalid3).toBe(true)

  const isInvalid4 = isInvalidTradingValue('0.0')
  expect(isInvalid4).toBe(true)

  const isInvalid5 = isInvalidTradingValue('0.00')
  expect(isInvalid5).toBe(true)

  const isInvalid6 = isInvalidTradingValue('')
  expect(isInvalid6).toBe(true)

  const isInvalid7 = isInvalidTradingValue('NaN')
  expect(isInvalid7).toBe(true)

  const isInvalid8 = isInvalidTradingValue('Infinity')
  expect(isInvalid8).toBe(true)

  const isInvalid9 = isInvalidTradingValue(',')
  expect(isInvalid9).toBe(true)

  const isInvalid10 = isInvalidTradingValue('.0')
  expect(isInvalid10).toBe(true)

  const isInvalid11 = isInvalidTradingValue('0.01')
  expect(isInvalid11).toBe(false)

  const isInvalid12 = isInvalidTradingValue('0.1')
  expect(isInvalid12).toBe(false)

  const isInvalid13 = isInvalidTradingValue('10,009.01')
  expect(isInvalid13).toBe(false)
})

test('isEditMode', () => {
  const inEditMode = isEditMode('1')
  expect(inEditMode).toBe(false)

  const inEditMode2 = isEditMode('000,000')
  expect(inEditMode2).toBe(true)

  const inEditMode3 = isEditMode(',000,000')
  expect(inEditMode3).toBe(true)

  const inEditMode4 = isEditMode(',98')
  expect(inEditMode4).toBe(true)

  const inEditMode5 = isEditMode('0.00')
  expect(inEditMode5).toBe(false)

  const inEditMode6 = isEditMode('')
  expect(inEditMode6).toBe(true)

  const inEditMode7 = isEditMode('NaN')
  expect(inEditMode7).toBe(false)

  const inEditMode8 = isEditMode('Infinity')
  expect(inEditMode8).toBe(false)

  const inEditMode9 = isEditMode(',')
  expect(inEditMode9).toBe(false)

  const inEditMode10 = isEditMode('0.')
  expect(inEditMode10).toBe(true)

  const inEditMode11 = isEditMode('0.01')
  expect(inEditMode11).toBe(false)

  const inEditMode12 = isEditMode('0.1')
  expect(inEditMode12).toBe(true)

  const inEditMode13 = isEditMode('10,009.01')
  expect(inEditMode13).toBe(false)

  const inEditMode14 = isEditMode('0.0')
  expect(inEditMode14).toBe(true)
})

const prevState: TileState = {
  canExecute: false,
  inputDisabled: false,
  inputValidationMessage: null,
  notional: '1,000,000',
  tradingDisabled: false,
}

const defaultParams: DerivedStateFromUserInput = {
  actions: {
    setTradingMode: (tradingMode: TradingMode) => {},
  },
  prevState,
  notionalUpdate: {
    type: 'blur',
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
}

const defaultNewState: TileState = {
  canExecute: false,
  inputDisabled: false,
  inputValidationMessage: null,
  notional: '1,000,000',
  tradingDisabled: false,
}

test('state derived from user interaction on change', () => {
  const newParams = {
    ...defaultParams,
    notionalUpdate: {
      type: 'change',
      value: '1,000',
    },
  }
  const newState = getDerivedStateFromUserInput(newParams)
  const expected = {
    ...defaultNewState,
    notional: '1,000',
    tradingDisabled: false,
  }
  expect(newState).toEqual(expected)

  const newParams2 = {
    ...defaultParams,
    notionalUpdate: {
      type: 'change',
      value: ',000,000',
    },
  }
  const newState2 = getDerivedStateFromUserInput(newParams2)
  const expected2 = {
    ...defaultNewState,
    notional: ',000,000',
    tradingDisabled: true,
  }
  expect(newState2).toEqual(expected2)

  const newParams3 = {
    ...defaultParams,
    notionalUpdate: {
      type: 'change',
      value: ',000,000',
    },
  }
  const newState3 = getDerivedStateFromUserInput(newParams3)
  const expected3 = {
    ...defaultNewState,
    notional: ',000,000',
    tradingDisabled: true,
  }
  expect(newState3).toEqual(expected3)
})
