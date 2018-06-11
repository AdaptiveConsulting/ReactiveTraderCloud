import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../connectionActions'
import { buildNotification } from '../notification/notificationUtils'
import { tradeError, tradeSuccesful } from './../../types/executeTradeRequest'
import { ACTION_TYPES, SpotTileActions } from './actions'

const updateSpotTile = (state, symbol, value) => {
  return {
    ...state,
    [symbol]: {
      ...state[symbol],
      ...value
    }
  }
}

export const spotTileDataReducer = (state: any = {}, action: SpotTileActions | DisconnectAction) => {
  switch (action.type) {
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      return updateSpotTile(state, action.payload, {
        currencyChartIsOpening: true
      })

    case ACTION_TYPES.CURRENCY_CHART_OPENED:
      return updateSpotTile(state, action.payload, { currencyChartIsOpening: false })

    case ACTION_TYPES.EXECUTE_TRADE:
      return updateSpotTile(state, action.payload.CurrencyPair, {
        isTradeExecutionInFlight: true
      })

    case ACTION_TYPES.TRADE_EXECUTED: {
      const { payload } = action
      const symbol = action.payload.request.CurrencyPair

      if (tradeError(payload)) {
        return updateSpotTile(state, symbol, {
          hasError: true,
          isTradeExecutionInFlight: false,
          notification: buildNotification(null, payload.error)
        })
      }
      if (tradeSuccesful(payload)) {
        return updateSpotTile(state, symbol, {
          hasError: false,
          isTradeExecutionInFlight: false,
          notification: buildNotification(payload.trade)
        })
      }
      return state
    }
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return updateSpotTile(state, action.payload, { notification: null })
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}

export default spotTileDataReducer
