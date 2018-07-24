import { TradeErrorResponse, TradeSuccessResponse } from '../../types'
import { SpotTileData } from '../../types/spotTileData'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../connectionStatus'
import { ACTION_TYPES, SpotTileActions } from './actions'
import { buildNotification } from './components/tradeNotification/notificationUtils'

interface SpotTileState {
  [currencyPair: string]: SpotTileData
}

const INITIAL_STATE: SpotTileState = {}

const INITIAL_SPOT_TILE_STATE: SpotTileData = {
  isTradeExecutionInFlight: false,
  currencyChartIsOpening: false,
  hasError: false
}

const spotTileReducer = (state: SpotTileData, action: SpotTileActions): SpotTileData => {
  switch (action.type) {
    case ACTION_TYPES.SHOW_SPOT_TILE:
      return { ...INITIAL_SPOT_TILE_STATE }
    case ACTION_TYPES.SPOT_PRICES_UPDATE:
      return { ...state, price: action.payload }
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
    case ACTION_TYPES.SHOW_SPOT_TILE:
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
    case ACTION_TYPES.SPOT_PRICES_UPDATE:
      return {
        ...state,
        [action.payload.symbol]: spotTileReducer(state[action.payload.symbol], action)
      }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}

export default spotTileDataReducer
