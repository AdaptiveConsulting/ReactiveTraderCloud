import numeral from 'numeral'
import { convertNotionalShorthandToNumericValue } from './notional/utils'
import { ServiceConnectionStatus } from 'rt-types'
import { TileProps, TileState } from './Tile'
import { NotionalUpdate } from './notional/NotionalInput'
import { SpotTileData } from '../model/spotTileData'

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
const invalidValuesRegex = /^(\.|0|.0|0.|0.0|^$|Infinity|NaN)$/
const isInvalidTradingValue = (value: string) => value.match(invalidValuesRegex)

// State management derived from props
export const getDerivedStateFromProps = (nextProps: TileProps, prevState: TileState) => {
  const { spotTileData, executionStatus } = nextProps
  const { inputValidationMessage } = prevState

  const isInTrade = !Boolean(
    executionStatus === ServiceConnectionStatus.CONNECTED &&
      !spotTileData.isTradeExecutionInFlight &&
      spotTileData.price,
  )

  const canExecute =
    !isInTrade &&
    spotTileData.rfqState !== 'canRequest' &&
    spotTileData.rfqState !== 'requested' &&
    !inputValidationMessage
  const inputDisabled = isInTrade || spotTileData.rfqState === 'requested'

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
  const numericValue = convertNotionalShorthandToNumericValue(value)
  const { symbol } = spotTileData.price

  const defaultNextState: TileState = {
    ...prevState,
    notional: value,
    inputValidationMessage: null,
    tradingDisabled: false,
  }

  if (type === 'blur' && isInvalidTradingValue(value)) {
    // onBlur if invalid trading value, reset value
    // remove any message, enable trading
    actions.setTradingMode({ symbol, mode: 'esp' })
    return {
      ...defaultNextState,
      notional: numeral(RESET_NOTIONAL_VALUE).format(NUMERAL_FORMAT),
    }
  } else if (isInvalidTradingValue(value)) {
    // onChange if invalid trading value, update value
    // user is trying to enter decimals or deleting previous entry (empty string)
    // in those cases, disable trading, remove any message
    actions.setTradingMode({ symbol, mode: 'esp' })
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (numericValue >= MIN_RFQ_VALUE && numericValue <= MAX_NOTIONAL_VALUE) {
    // if in RFQ range, set tradingMode to 'rfq' to trigger prompt
    // remove any message, disable trading
    actions.setTradingMode({ symbol, mode: 'rfq' })
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (numericValue > MAX_NOTIONAL_VALUE) {
    // if value exceeds Max, show error message
    // update value, disable trading
    actions.setTradingMode({ symbol, mode: 'rfq' })
    return {
      ...defaultNextState,
      inputValidationMessage: {
        type: 'error',
        content: 'Max exceeded',
      },
      tradingDisabled: true,
    }
  } else {
    // if under RFQ range, back to ESP (tradingMode: 'esp')
    // update value, remove message, enable trading
    actions.setTradingMode({ symbol, mode: 'esp' })
    return {
      ...defaultNextState,
    }
  }
}
