import { CONNECTION_ACTION_TYPES, DisconnectAction } from 'rt-actions'
import { SpotTileAction, TILE_ACTION_TYPES } from './actions'
import { PriceMovementTypes } from './model/priceMovementTypes'
import { SpotTileData } from './model/spotTileData'

// we want to let compiler know that values for certain keys might be missing
export type SpotTileState = Record<string, SpotTileData | undefined>

const INITIAL_STATE: SpotTileState = {}
const HISTORIC_PRICES_MAX_POINTS = 100

const INITIAL_SPOT_TILE_STATE: SpotTileData = {
  isTradeExecutionInFlight: false,
  lastTradeExecutionStatus: null,
  historicPrices: [],
  price: {
    ask: 0,
    bid: 0,
    mid: 0,
    creationTimestamp: 0,
    symbol: '',
    valueDate: '',
    priceMovementType: PriceMovementTypes.None,
    priceStale: false,
  },
  rfqState: 'none',
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null,
}

const spotTileReducer = (
  state: SpotTileData = { ...INITIAL_SPOT_TILE_STATE },
  action: SpotTileAction
): SpotTileData => {
  switch (action.type) {
    case TILE_ACTION_TYPES.SET_NOTIONAL:
      return {
        ...state,
        notional: action.payload.notional,
      }
    case TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE:
      return state
    case TILE_ACTION_TYPES.SPOT_PRICES_UPDATE:
      const startIndexUpdatePrices = Math.max(
        1,
        state.historicPrices.length - HISTORIC_PRICES_MAX_POINTS
      )
      return {
        ...state,
        price: action.payload,
        historicPrices: [
          ...state.historicPrices.slice(startIndexUpdatePrices, state.historicPrices.length),
          action.payload,
        ],
      }
    case TILE_ACTION_TYPES.PRICE_HISTORY_RECEIVED:
      const startIndexPrices = Math.max(1, action.payload.length - HISTORIC_PRICES_MAX_POINTS)
      return {
        ...state,
        historicPrices: action.payload.slice(startIndexPrices, action.payload.length),
      }
    case TILE_ACTION_TYPES.EXECUTE_TRADE:
      return { ...state, isTradeExecutionInFlight: true }
    case TILE_ACTION_TYPES.TRADE_EXECUTED: {
      return {
        ...state,
        lastTradeExecutionStatus: action.payload,
        isTradeExecutionInFlight: false,
      }
    }
    case TILE_ACTION_TYPES.DISMISS_NOTIFICATION:
      return { ...state, lastTradeExecutionStatus: null }
    default:
      return state
  }
}

const rfqTileReducer = (
  state: SpotTileData = { ...INITIAL_SPOT_TILE_STATE },
  action: SpotTileAction
): SpotTileData => {
  const newState: SpotTileData = {
    ...state,
    rfqReceivedTime: null,
    rfqTimeout: null,
    rfqPrice: null,
  }
  switch (action.type) {
    case TILE_ACTION_TYPES.SET_TRADING_MODE:
      return {
        ...newState,
        rfqState: action.payload.mode === 'rfq' ? 'canRequest' : 'none',
      }
    case TILE_ACTION_TYPES.RFQ_REQUEST:
    case TILE_ACTION_TYPES.RFQ_REQUOTE:
      return {
        ...newState,
        rfqState: 'requested',
      }
    case TILE_ACTION_TYPES.RFQ_CANCEL:
    case TILE_ACTION_TYPES.RFQ_RESET:
      return {
        ...newState,
        rfqState: 'canRequest',
      }
    case TILE_ACTION_TYPES.RFQ_RECEIVED:
      return {
        ...newState,
        rfqState: 'received',
        rfqReceivedTime: action.payload.time,
        rfqTimeout: action.payload.timeout,
        rfqPrice: action.payload.price,
      }
    case TILE_ACTION_TYPES.RFQ_EXPIRED:
    case TILE_ACTION_TYPES.RFQ_REJECT:
      return {
        ...state, // Use state instead of newState to not reset rfqTimeout and rfqPrice
        rfqState: 'expired',
      }
    default:
      return newState
  }
}

export const spotTileDataReducer = (
  state: SpotTileState = INITIAL_STATE,
  action: SpotTileAction | DisconnectAction
): SpotTileState => {
  switch (action.type) {
    case TILE_ACTION_TYPES.SET_NOTIONAL:
      return {
        ...state,
        [action.payload.currencyPair]: spotTileReducer(state[action.payload.currencyPair], action),
      }
    case TILE_ACTION_TYPES.SET_TRADING_MODE:
      return {
        ...state,
        [action.payload.symbol]: rfqTileReducer(state[action.payload.symbol], action),
      }
    case TILE_ACTION_TYPES.RFQ_REQUEST:
    case TILE_ACTION_TYPES.RFQ_REQUOTE:
    case TILE_ACTION_TYPES.RFQ_CANCEL:
    case TILE_ACTION_TYPES.RFQ_RECEIVED:
    case TILE_ACTION_TYPES.RFQ_EXPIRED:
    case TILE_ACTION_TYPES.RFQ_REJECT:
    case TILE_ACTION_TYPES.RFQ_RESET:
      return {
        ...state,
        [action.payload.currencyPair.symbol]: rfqTileReducer(
          state[action.payload.currencyPair.symbol],
          action
        ),
      }
    case TILE_ACTION_TYPES.DISMISS_NOTIFICATION:
      const shouldDismiss =
        !action.payload.id ||
        (state[action.payload.currencyPair] &&
          state[action.payload.currencyPair]!.lastTradeExecutionStatus &&
          state[action.payload.currencyPair]!.lastTradeExecutionStatus!.request.id ===
            action.payload.id)
      return {
        ...state,
        [action.payload.currencyPair]: shouldDismiss
          ? spotTileReducer(state[action.payload.currencyPair], action)
          : state[action.payload.currencyPair],
      }
    case TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE:
      return {
        ...state,
        [action.payload]: spotTileReducer(state[action.payload], action),
      }
    case TILE_ACTION_TYPES.EXECUTE_TRADE:
      return {
        ...state,
        [action.payload.CurrencyPair]: spotTileReducer(state[action.payload.CurrencyPair], action),
      }
    case TILE_ACTION_TYPES.TRADE_EXECUTED:
      return {
        ...state,
        [action.payload.request.CurrencyPair]: spotTileReducer(
          state[action.payload.request.CurrencyPair],
          action
        ),
      }
    case TILE_ACTION_TYPES.SPOT_PRICES_UPDATE:
      return state[action.payload.symbol]
        ? {
            ...state,
            [action.payload.symbol]: spotTileReducer(state[action.payload.symbol], action),
          }
        : state
    case TILE_ACTION_TYPES.PRICE_HISTORY_RECEIVED:
      return {
        ...state,
        [action.meta]: spotTileReducer(state[action.meta], action),
      }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}

export default spotTileDataReducer
