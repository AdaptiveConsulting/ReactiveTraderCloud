import { buildNotification } from '../notification/notificationUtils'
import { ACTION_TYPES } from './actions'
import { DISCONNECT_SERVICES } from '../../connectionActions'

const updateSpotTile = (state, symbol, value) => {
  return {
    ...state,
    [symbol]: {
      ...state[symbol],
      ...value
    }
  }
}

export const spotTileDataReducer = (state: any = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      return updateSpotTile(state, payload.symbol, {
        currencyChartIsOpening: true
      })

    case ACTION_TYPES.CURRENCY_CHART_OPENED:
      return updateSpotTile(state, payload, { currencyChartIsOpening: false })

    case ACTION_TYPES.EXECUTE_TRADE:
      return updateSpotTile(state, payload.CurrencyPair, {
        isTradeExecutionInFlight: true
      })

    case ACTION_TYPES.TRADE_EXECUTED:
      const symbol = payload.request.CurrencyPair
      return updateSpotTile(state, symbol, {
        hasError: payload.hasError,
        isTradeExecutionInFlight: false,
        notification: buildNotification(payload.trade, payload.error)
      })

    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return updateSpotTile(state, payload.symbol, { notification: null })
    case DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}

export default spotTileDataReducer
