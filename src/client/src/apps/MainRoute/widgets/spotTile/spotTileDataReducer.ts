import { CONNECTION_ACTION_TYPES, DisconnectAction } from 'rt-actions'
import { SpotTileActions, TILE_ACTION_TYPES } from './actions'
import { PriceMovementTypes } from './model/priceMovementTypes'
import { SpotTileData } from './model/spotTileData'

export interface SpotTileState {
  [currencyPair: string]: SpotTileData
}

const INITIAL_STATE: SpotTileState = {}

const INITIAL_SPOT_TILE_STATE: SpotTileData = {
  isTradeExecutionInFlight: false,
  currencyChartIsOpening: false,
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
  rfqTimeout: null
}

const spotTileReducer = (
  state: SpotTileData = { ...INITIAL_SPOT_TILE_STATE },
  action: SpotTileActions,
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
      return {
        ...state,
        price: action.payload,
        historicPrices: [...state.historicPrices.slice(1), action.payload],
      }
    case TILE_ACTION_TYPES.PRICE_HISTORY_RECEIVED:
      return { ...state, historicPrices: action.payload }
    case TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      return { ...state, currencyChartIsOpening: true }
    case TILE_ACTION_TYPES.CURRENCY_CHART_OPENED:
      return { ...state, currencyChartIsOpening: false }
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
  action: SpotTileActions,
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
  action: SpotTileActions | DisconnectAction,
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
          action,
        ),
      }
    case TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART:
    case TILE_ACTION_TYPES.CURRENCY_CHART_OPENED:
    case TILE_ACTION_TYPES.DISMISS_NOTIFICATION:
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
          action,
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
