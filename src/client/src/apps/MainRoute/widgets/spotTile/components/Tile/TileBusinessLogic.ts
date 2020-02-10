import numeral from 'numeral'
import { CurrencyPair, ServiceConnectionStatus } from 'rt-types'
import { TileProps, TileState } from './Tile'
import { getConstsFromRfqState } from '../../model/spotTileUtils'
import { SpotTileData } from '../../model'

// Constants
export const NUMERAL_FORMAT = '0,000,000[.]00'
const DEFAULT_NOTIONAL_VALUE = 1000000
const MAX_NOTIONAL_VALUE = 1000000000
const MIN_RFQ_VALUE = 10000000

// Utils
export const getFormattedValue = (value: number | string) => numeral(value).format(NUMERAL_FORMAT)
export const getDefaultNotionalValue = (currencyPair: CurrencyPair | undefined) =>
  // This is to simply to have one Tile showing RFQ prompt on page load
  // check JIRA ticket ARTP-532
  currencyPair && currencyPair.symbol === 'NZDUSD' ? MIN_RFQ_VALUE : DEFAULT_NOTIONAL_VALUE

export const isValueInRfqRange = (notional: number) => {
  return notional >= MIN_RFQ_VALUE && notional <= MAX_NOTIONAL_VALUE
}

export const isValueOverRfqRange = (notional: number) => {
  if (typeof notional === 'undefined') {
    return false
  }
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

  const isInTrade = !Boolean(
    executionStatus === ServiceConnectionStatus.CONNECTED && !isTradeExecutionInFlight && price,
  )

  const { isRfqStateRequested, isRfqStateReceived, isRfqStateNone } = getConstsFromRfqState(
    rfqState,
  )

  const canExecute = !isInTrade && (isRfqStateReceived || isRfqStateNone)

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
  const { rfqState } = spotTileData
  const notional = spotTileData.notional || getDefaultNotionalValue(currencyPair)

  const defaultNextState: TileState = {
    ...prevState,
    inputValidationMessage: undefined,
  }

  const { isRfqStateNone } = getConstsFromRfqState(rfqState)

  if (isValueOverRfqRange(notional) || isValueInRfqRange(notional)) {
    if (isRfqStateNone) actions.setTradingMode({ symbol, mode: 'rfq' })
  } else {
    if (!isRfqStateNone) actions.setTradingMode({ symbol, mode: 'esp' })
  }

  if (notional === 0) {
    return {
      ...defaultNextState,
      canExecute: false,
      inputValidationMessage: {
        type: 'error',
        content: '',
      },
    }
  }

  return isValueOverRfqRange(notional)
    ? {
        ...defaultNextState,
        inputValidationMessage: {
          type: 'error',
          content: 'Max exceeded',
        },
      }
    : { ...defaultNextState }
}
