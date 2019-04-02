import numeral from 'numeral'
import { convertNotionalShorthandToNumericValue } from '../notional/utils'
import { ServiceConnectionStatus, CurrencyPair } from 'rt-types'
import { TileProps, TileState } from './Tile'
import { NotionalUpdate } from '../notional/NotionalInput'
import { SpotTileData } from '../../model/spotTileData'

// Constants
export const NUMERAL_FORMAT = '0,000,000[.]00'
const DEFAULT_NOTIONAL_VALUE = 1000000
const MAX_NOTIONAL_VALUE = 1000000000
const MIN_RFQ_VALUE = 10000000
const RESET_NOTIONAL_VALUE = DEFAULT_NOTIONAL_VALUE

// Utils
export const getDefaultNotionalValue = (currencyPair: CurrencyPair) =>
  // This is to simply to have one Tile showing RFQ prompt on page load
  // check JIRA ticket ARTP-532
  currencyPair.symbol === 'NZDUSD'
    ? numeral(MIN_RFQ_VALUE).format(NUMERAL_FORMAT)
    : numeral(DEFAULT_NOTIONAL_VALUE).format(NUMERAL_FORMAT)

export const getNumericNotional = (notional: string) =>
  numeral(notional).value() || DEFAULT_NOTIONAL_VALUE

export const isValueInRfqRange = (notional: string) => {
  const numericValue = convertNotionalShorthandToNumericValue(notional)
  return numericValue >= MIN_RFQ_VALUE && numericValue <= MAX_NOTIONAL_VALUE
}

export const isValueOverRftRange = (notional: string) => {
  const numericValue = convertNotionalShorthandToNumericValue(notional)
  return numericValue > MAX_NOTIONAL_VALUE
}

// To make sure the user can't trade with invalid values
const invalidTradingValuesRegex = /^(\.|,|0|.0|0.|0.0|0.00|$|Infinity|NaN)$/
export const isInvalidTradingValue = (value: string) =>
  Boolean(value.match(invalidTradingValuesRegex))

// To make sure the notional input doesn't format on the fly in these cases
const editModeRegex = /(?!.*(0\.)).*^(,|$|0)/
export const isEditMode = (value: string) => Boolean(value.match(editModeRegex))

// State management derived from props
export const getDerivedStateFromProps = (nextProps: TileProps, prevState: TileState) => {
  const {
    spotTileData: { rfqState, price, isTradeExecutionInFlight },
    executionStatus,
  } = nextProps

  const { inputValidationMessage } = prevState

  const isInTrade = !Boolean(
    executionStatus === ServiceConnectionStatus.CONNECTED && !isTradeExecutionInFlight && price,
  )

  const canExecute =
    !isInTrade && rfqState !== 'canRequest' && rfqState !== 'requested' && !inputValidationMessage

  const inputDisabled = isInTrade || rfqState === 'requested' || rfqState === 'received'

  return {
    ...prevState,
    inputDisabled,
    canExecute,
  }
}

interface DerivedStateFromUserInput {
  prevState: TileState
  spotTileData: SpotTileData
  notionalUpdate: NotionalUpdate
  actions: {
    setTradingMode: TileProps['setTradingMode']
  }
}

// State management derived from user input
export const getDerivedStateFromUserInput = ({
  prevState,
  spotTileData,
  notionalUpdate,
  actions,
}: DerivedStateFromUserInput): TileState => {
  const { type, value } = notionalUpdate
  const {
    price: { symbol },
    rfqState,
  } = spotTileData

  const defaultNextState: TileState = {
    ...prevState,
    notional: value,
    inputValidationMessage: null,
    tradingDisabled: false,
  }

  if (type === 'change' && isEditMode(value)) {
    // user is trying to enter decimals or modifying a number
    // or deleting previous entry (empty string)
    // disable trading, remove any message
    if (rfqState !== 'none') {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (type === 'blur' && isInvalidTradingValue(value)) {
    // onBlur if invalid trading value, reset value
    // remove any message, enable trading
    if (rfqState !== 'none') {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      notional: numeral(RESET_NOTIONAL_VALUE).format(NUMERAL_FORMAT),
    }
  } else if (type === 'blur' && isEditMode(value)) {
    // onBlur if in editMore, format value
    // remove any message, enable trading
    if (rfqState !== 'none') {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      notional: numeral(value).format(NUMERAL_FORMAT),
    }
  } else if (isInvalidTradingValue(value)) {
    // onChange if invalid trading value, update value
    // disable trading, remove any message
    if (rfqState !== 'none') {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (isValueInRfqRange(value)) {
    // if in RFQ range, set tradingMode to 'rfq' to trigger prompt
    // remove any message, disable trading
    if (rfqState === 'none') {
      actions.setTradingMode({ symbol, mode: 'rfq' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (isValueOverRftRange(value)) {
    // if value exceeds Max, show error message
    // update value, disable trading
    if (rfqState === 'none') {
      actions.setTradingMode({ symbol, mode: 'rfq' })
    }
    return {
      ...defaultNextState,
      inputValidationMessage: {
        type: 'error',
        content: 'Max exceeded',
      },
      tradingDisabled: true,
    }
  } else {
    // if under RFQ range, back to 'esp'
    // update value, remove message, enable trading
    if (rfqState !== 'none') {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
    }
  }
}

interface DerivedStateFromNotionalReset {
  prevState: TileState
  spotTileData: SpotTileData
  actions: {
    setTradingMode: TileProps['setTradingMode']
  }
  currencyPair: CurrencyPair
}

export const resetNotional = ({
  prevState,
  spotTileData: {
    price: { symbol },
  },
  actions,
  currencyPair,
}: DerivedStateFromNotionalReset): TileState => {
  const notional = getDefaultNotionalValue(currencyPair)
  const isInRfqRange = isValueInRfqRange(notional)
  if (isInRfqRange) {
    actions.setTradingMode({ symbol, mode: 'rfq' })
  } else {
    actions.setTradingMode({ symbol, mode: 'esp' })
  }
  return {
    ...prevState,
    notional,
    inputValidationMessage: null,
    tradingDisabled: false,
  }
}
