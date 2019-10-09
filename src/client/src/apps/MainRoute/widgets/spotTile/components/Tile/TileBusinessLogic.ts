import numeral from 'numeral'
import { ServiceConnectionStatus, CurrencyPair } from 'rt-types'
import { TileProps, TileState } from './Tile'
import { SpotTileData } from '../../model/spotTileData'
import { getConstsFromRfqState } from '../../model/spotTileUtils'

// Constants
export const NUMERAL_FORMAT = '0,000,000[.]00'
const DEFAULT_NOTIONAL_VALUE = 1000000
const MAX_NOTIONAL_VALUE = 1000000000
const MIN_RFQ_VALUE = 10000000

// Utils
export const getFormattedValue = (value: number | string) => numeral(value).format(NUMERAL_FORMAT)
export const getDefaultNotionalValue = () => DEFAULT_NOTIONAL_VALUE
export const getDefaultInitialNotionalValue = (currencyPair: CurrencyPair) =>
  // This is to simply to have one Tile showing RFQ prompt on page load
  // check JIRA ticket ARTP-532
  currencyPair.symbol === 'NZDUSD' ? MIN_RFQ_VALUE : DEFAULT_NOTIONAL_VALUE

export const isValueInRfqRange = (notional: number) => {
  return notional >= MIN_RFQ_VALUE && notional <= MAX_NOTIONAL_VALUE
}

export const isValueOverRfqRange = (notional: number) => {
  return notional > MAX_NOTIONAL_VALUE
}

// With these values, user should not be able to trade
export const isInvalidTradingValue = (value: number) =>
  value === 0 || value === Infinity || value === -Infinity || Number.isNaN(value)

// State management derived from props
export const getDerivedStateFromProps = (nextProps: TileProps, prevState: TileState) => {
  const {
    spotTileData: { rfqState, price, isTradeExecutionInFlight },
    executionStatus,
  } = nextProps

  const { tradingDisabled } = prevState

  const isInTrade = !Boolean(
    executionStatus === ServiceConnectionStatus.CONNECTED && !isTradeExecutionInFlight && price,
  )

  const {
    isRfqStateCanRequest,
    isRfqStateRequested,
    isRfqStateReceived,
    isRfqStateExpired,
  } = getConstsFromRfqState(rfqState)

  const canExecute =
    !isInTrade &&
    !isRfqStateCanRequest &&
    !isRfqStateRequested &&
    !isRfqStateExpired &&
    !tradingDisabled

  const inputDisabled = isInTrade || isRfqStateRequested || isRfqStateReceived

  return {
    ...prevState,
    inputDisabled,
    canExecute,
  }
}

// State management derived from user input
export const getDerivedStateFromUserInput = ({
  prevState,
  spotTileData,
  actions,
  currencyPair,
}: {
  prevState: TileState
  spotTileData: SpotTileData
  actions: {
    setTradingMode: TileProps['setTradingMode']
  }
  currencyPair: CurrencyPair
}): TileState => {
  const { symbol } = currencyPair
  const { rfqState, notional } = spotTileData

  const defaultNextState: TileState = {
    ...prevState,
    inputValidationMessage: null,
    tradingDisabled: false,
  }

  const { isRfqStateNone } = getConstsFromRfqState(rfqState)

  if (isInvalidTradingValue(notional)) {
    // onChange if invalid trading value, update value
    // disable trading, remove any message
    if (!isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'esp' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (isValueInRfqRange(notional)) {
    // if in RFQ range, set tradingMode to 'rfq' to trigger prompt
    // remove any message, disable trading
    if (isRfqStateNone) {
      actions.setTradingMode({ symbol, mode: 'rfq' })
    }
    return {
      ...defaultNextState,
      tradingDisabled: true,
    }
  } else if (isValueOverRfqRange(notional)) {
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
