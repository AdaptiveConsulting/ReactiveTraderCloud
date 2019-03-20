import numeral from 'numeral'
import { convertNotionalShorthandToNumericValue } from './notional/utils'
import { ServiceConnectionStatus } from 'rt-types'
import { TileProps, TileState } from './Tile'
import { NotionalUpdate } from './notional/NotionalInput'

// Constants
export const NUMERAL_FORMAT = '0,000,000[.]00'
const DEFAULT_NOTIONAL_VALUE = 1000000
const MAX_NOTIONAL_VALUE = 1000000000
const MIN_RFQ_VALUE = 10000000
const RESET_NOTIONAL_VALUE = DEFAULT_NOTIONAL_VALUE

// Utils
export const getDefaultNotionalValue = () => numeral(DEFAULT_NOTIONAL_VALUE).format(NUMERAL_FORMAT)
export const getNumericNotional = (notional: string) =>
  numeral(notional).value() || DEFAULT_NOTIONAL_VALUE
const invalidValuesRegex = /^(.|0|.0|0.|0.0|^$|Infinity|NaN)$/
const isInvalidTradingValue = (value: string) => value.match(invalidValuesRegex)

// State management derived from props
export const getDerivedStateFromProps = (nextProps: TileProps, prevState: TileState) => {
  const { spotTileData, executionStatus } = nextProps
  const { rfqState, tradingDisabled } = prevState

  const isInTrade = !Boolean(
    executionStatus === ServiceConnectionStatus.CONNECTED &&
      !spotTileData.isTradeExecutionInFlight &&
      spotTileData.price,
  )

  const canExecute = !tradingDisabled && rfqState !== 'canRequest' && !isInTrade
  const inputDisabled = isInTrade

  return {
    ...prevState,
    inputDisabled, // TODO Check if I can avoid `inputDisabled` existing at all in the state
    canExecute,
  }
}

// State management derived from user input
export const getDerivedStateFromUserInput = (
  prevState: TileState,
  { value, type }: NotionalUpdate,
): TileState => {
  console.log(type, value)
  const numericValue = convertNotionalShorthandToNumericValue(value)

  if (type === 'blur' && isInvalidTradingValue(value)) {
    // onBlur if invalid trading value, reset value
    // remove any message, enable trading
    return {
      ...prevState,
      notional: numeral(RESET_NOTIONAL_VALUE).format(NUMERAL_FORMAT),
      inputValidationMessage: null,
      rfqState: 'none',
      tradingDisabled: false,
    }
  } else if (isInvalidTradingValue(value)) {
    // onChange if invalid trading value, update value
    // user is trying to enter decimals or deleting previous entry (empty string)
    // in those cases, disable trading, remove any message
    return {
      ...prevState,
      notional: value,
      inputValidationMessage: null,
      rfqState: 'none',
      tradingDisabled: true,
    }
  } else if (numericValue >= MIN_RFQ_VALUE && numericValue <= MAX_NOTIONAL_VALUE) {
    // if in RFQ range, set rfqState to 'canRequest' to trigger prompt
    // remove any message, disable trading
    return {
      ...prevState,
      notional: value,
      inputValidationMessage: null,
      rfqState: 'canRequest',
      tradingDisabled: true,
    }
  } else if (numericValue > MAX_NOTIONAL_VALUE) {
    // if value exceeds Max, show error message
    // update value, disable trading
    return {
      ...prevState,
      notional: value,
      inputValidationMessage: {
        type: 'error',
        content: 'Max exceeded',
      },
      rfqState: 'canRequest',
      tradingDisabled: true,
    }
  } else if (numericValue < MIN_RFQ_VALUE) {
    // if under RFQ range, back to ESP (rfqState: 'none')
    // update value, remove message, enable trading
    return {
      ...prevState,
      notional: value,
      inputValidationMessage: null,
      rfqState: 'none',
      tradingDisabled: false,
    }
  } else {
    // This case should not happen
    // Simply to prevent stuff from breaking
    return {
      ...prevState,
      notional: value,
      inputValidationMessage: null,
      tradingDisabled: false,
    }
  }
}
