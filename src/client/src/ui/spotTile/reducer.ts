import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../operations/connectionStatus'
import { Notification } from '../../types'
import { SpotTileData } from '../../types/spotTileData'
import { buildNotification } from '../notification/notificationUtils'
import { tradeError, tradeSuccesful } from './../../types/executeTradeRequest'
import { ACTION_TYPES, SpotTileActions } from './actions'

const updateSpotTile = (state: SpotTileState, symbol: string, value: SpotTileValue): SpotTileState => ({
  ...state,
  [symbol]: {
    ...state[symbol],
    ...value
  }
})

interface SpotTileState {
  [currencyPair: string]: SpotTileData
}

interface SpotTileValue {
  currencyChartIsOpening?: boolean
  hasError?: boolean
  isTradeExecutionInFlight?: boolean
  notification?: Notification
}

const INITIAL_STATE: SpotTileState = {}

export const spotTileDataReducer = (
  state: SpotTileState = INITIAL_STATE,
  action: SpotTileActions | DisconnectAction
): SpotTileState => {
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
      return INITIAL_STATE
    default:
      return state
  }
}

export default spotTileDataReducer
