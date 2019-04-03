import numeral from 'numeral'
import { convertNotionalShorthandToNumericValue } from './notional/utils'
import { ServiceConnectionStatus } from 'rt-types'
import { TileProps, TileState } from './Tile'
import { NotionalUpdate } from './notional/NotionalInput'
import { SpotTileData } from '../model/spotTileData'
import { getConstsFromRfqState } from '../model/spotTileUtils'

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
export const isValueInRfqRange = (notional: string) => {
  const numericValue = convertNotionalShorthandToNumericValue(notional)
  return numericValue >= MIN_RFQ_VALUE && numericValue <= MAX_NOTIONAL_VALUE
}
const isValueOverRftRange = (notional: string) => {
  const numericValue = convertNotionalShorthandToNumericValue(notional)
  return numericValue > MAX_NOTIONAL_VALUE
}
const invalidTradingValuesRegex = /^(\.|,|0|.0|0.|0.0|$|Infinity|NaN)$/
const isInvalidTradingValue = (value: string) => value.match(invalidTradingValuesRegex)
const editModeRegex = /(?!.*(0\.)).*^(,|$|0)/
export const isEditMode = (value: string) => value.match(editModeRegex)

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

  const { isRfqStateCanRequest, isRfqStateRequested, isRfqStateReceived } = getConstsFromRfqState(
    rfqState,
  )

  const canExecute =
    !isInTrade && !isRfqStateCanRequest && !isRfqStateRequested && !inputValidationMessage

  const inputDisabled = isInTrade || isRfqStateRequested || isRfqStateReceived

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

interface DerivedStateFromNotionalReset {
  prevState: TileState
  spotTileData: SpotTileData
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

  const { isRfqStateNone } = getConstsFromRfqState(rfqState)

  if (type === 'change' && isEditMode(value)) {
    // user is trying to enter decimals or modifying a number
    // or deleting previous entry (empty string)
    // disable trading, remove any message
    if (!isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (type === 'blur' && isInvalidTradingValue(value)) {
    // onBlur if invalid trading value, reset value
    // remove any message, enable trading
    if (!isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      notional: numeral(RESET_NOTIONAL_VALUE).format(NUMERAL_FORMAT),
    }
  } else if (type === 'blur' && isEditMode(value)) {
    // onBlur if in editMore, format value
    // remove any message, enable trading
    if (!isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      notional: numeral(value).format(NUMERAL_FORMAT),
    }
  } else if (isInvalidTradingValue(value)) {
    // onChange if invalid trading value, update value
    // disable trading, remove any message
    if (!isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (isValueInRfqRange(value)) {
    // if in RFQ range, set tradingMode to 'rfq' to trigger prompt
    // remove any message, disable trading
    if (isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'rfq' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (isValueOverRftRange(value)) {
    // if value exceeds Max, show error message
    // update value, disable trading
    if (isRfqStateNone) {
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
    if (!isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
    }
  }
}

export const resetNotional = ({
  prevState,
  spotTileData: {
    price: { symbol },
    rfqState,
  },
  actions,
}: DerivedStateFromNotionalReset): TileState => {
  const { isRfqStateNone } = getConstsFromRfqState(rfqState)
  if (!isRfqStateNone) {
    actions.setTradingMode({ symbol, mode: 'esp' })
  }
  return {
    ...prevState,
    notional: getDefaultNotionalValue(),
    inputValidationMessage: null,
    tradingDisabled: false,
  }
}
