import { TradeErrorResponse, TradeSuccessResponse } from '../../types'
import { SpotTileData } from '../../types/spotTileData'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../connectionStatus'
import { buildNotification } from '../notification/notificationUtils'
import { ACTION_TYPES, SpotTileActions } from './actions'

interface SpotTileState {
  [currencyPair: string]: SpotTileData
}

const INITIAL_STATE: SpotTileState = {}

const spotTileReducer = (state: SpotTileData, action: SpotTileActions): SpotTileData => {
  switch (action.type) {
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      return { ...state, currencyChartIsOpening: true }
    case ACTION_TYPES.CURRENCY_CHART_OPENED:
      return { ...state, currencyChartIsOpening: false }
    case ACTION_TYPES.EXECUTE_TRADE:
      return { ...state, isTradeExecutionInFlight: true }
    case ACTION_TYPES.TRADE_EXECUTED: {
      const { hasError } = action.payload
      const notification = hasError
        ? buildNotification(null, (action.payload as TradeErrorResponse).error)
        : buildNotification((action.payload as TradeSuccessResponse).trade)
      return {
        ...state,
        hasError,
        notification,
        isTradeExecutionInFlight: false
      }
    }
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return { ...state, notification: null }
    default:
      return state
  }
}

export const spotTileDataReducer = (
  state: SpotTileState = INITIAL_STATE,
  action: SpotTileActions | DisconnectAction
): SpotTileState => {
  switch (action.type) {
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
    case ACTION_TYPES.CURRENCY_CHART_OPENED:
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return {
        ...state,
        [action.payload]: spotTileReducer(state[action.payload], action)
      }
    case ACTION_TYPES.EXECUTE_TRADE:
      return {
        ...state,
        [action.payload.CurrencyPair]: spotTileReducer(state[action.payload.CurrencyPair], action)
      }
    case ACTION_TYPES.TRADE_EXECUTED:
      return {
        ...state,
        [action.payload.request.CurrencyPair]: spotTileReducer(state[action.payload.request.CurrencyPair], action)
      }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}

export default spotTileDataReducer
