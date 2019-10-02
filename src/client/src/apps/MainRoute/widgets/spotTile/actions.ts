import { action, ActionUnion } from 'rt-util'
import { ExecuteTradeRequest, ExecuteTradeResponse } from './model/executeTradeRequest'
import { SpotPriceTick } from './model/spotPriceTick'
import { TradeExectionMeta } from './model/spotTileUtils'
import {
  RfqRequest,
  RfqReceived,
  RfqExpired,
  RfqCancel,
  RfqReject,
  RfqReset,
} from './model/rfqRequest'
import { TradingMode } from './components/types'
import { CurrencyPairNotional } from './model/spotTileData'

export enum TILE_ACTION_TYPES {
  SET_NOTIONAL = '@ReactiveTraderCloud/SET_NOTIONAL',
  SET_TRADING_MODE = '@ReactiveTraderCloud/SET_TRADING_MODE',
  RFQ_REQUEST = '@ReactiveTraderCloud/RFQ_REQUEST',
  RFQ_RECEIVED = '@ReactiveTraderCloud/RFQ_RECEIVED',
  RFQ_REJECT = '@ReactiveTraderCloud/RFQ_REJECT',
  RFQ_EXPIRED = '@ReactiveTraderCloud/RFQ_EXPIRED',
  RFQ_REQUOTE = '@ReactiveTraderCloud/RFQ_REQUOTE',
  RFQ_CANCEL = '@ReactiveTraderCloud/RFQ_CANCEL',
  RFQ_RESET = '@ReactiveTraderCloud/RFQ_RESET',
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED',
  DISPLAY_CURRENCY_CHART = '@ReactiveTraderCloud/DISPLAY_CURRENCY_CHART',
  CURRENCY_CHART_OPENED = '@ReactiveTraderCloud/CURRENCY_CHART_OPENED',
  DISMISS_NOTIFICATION = '@ReactiveTraderCloud/DISMISS_NOTIFICATION',
  SPOT_TILE_SUBSCRIBE = '@ReactiveTraderCloud/SPOT_TILE_SUBSCRIBE',
  SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE',
  PRICE_HISTORY_RECEIVED = '@ReactiveTraderCloud/PRICE_HISTORY_RECEIVED',
}

export const SpotTileActions = {
  setNotional: action<TILE_ACTION_TYPES.SET_NOTIONAL, CurrencyPairNotional>(
    TILE_ACTION_TYPES.SET_NOTIONAL,
  ),

  setTradingMode: action<TILE_ACTION_TYPES.SET_TRADING_MODE, TradingMode>(
    TILE_ACTION_TYPES.SET_TRADING_MODE,
  ),

  rfqRequest: action<TILE_ACTION_TYPES.RFQ_REQUEST, RfqRequest>(TILE_ACTION_TYPES.RFQ_REQUEST),

  rfqReceived: action<TILE_ACTION_TYPES.RFQ_RECEIVED, RfqReceived>(TILE_ACTION_TYPES.RFQ_RECEIVED),

  rfqExpired: action<TILE_ACTION_TYPES.RFQ_EXPIRED, RfqExpired>(TILE_ACTION_TYPES.RFQ_EXPIRED),

  rfqRequote: action<TILE_ACTION_TYPES.RFQ_REQUOTE, RfqRequest>(TILE_ACTION_TYPES.RFQ_REQUOTE),

  rfqReject: action<TILE_ACTION_TYPES.RFQ_REJECT, RfqReject>(TILE_ACTION_TYPES.RFQ_REJECT),

  rfqCancel: action<TILE_ACTION_TYPES.RFQ_CANCEL, RfqCancel>(TILE_ACTION_TYPES.RFQ_CANCEL),

  rfqReset: action<TILE_ACTION_TYPES.RFQ_RESET, RfqReset>(TILE_ACTION_TYPES.RFQ_RESET),

  executeTrade: action<
    TILE_ACTION_TYPES.EXECUTE_TRADE,
    ExecuteTradeRequest,
    TradeExectionMeta | null
  >(TILE_ACTION_TYPES.EXECUTE_TRADE),
  tradeExecuted: action<
    TILE_ACTION_TYPES.TRADE_EXECUTED,
    ExecuteTradeResponse,
    TradeExectionMeta | null
  >(TILE_ACTION_TYPES.TRADE_EXECUTED),
  displayCurrencyChart: action<TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART, string>(
    TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART,
  ),
  currencyChartOpened: action<TILE_ACTION_TYPES.CURRENCY_CHART_OPENED, string>(
    TILE_ACTION_TYPES.CURRENCY_CHART_OPENED,
  ),
  dismissNotification: action<TILE_ACTION_TYPES.DISMISS_NOTIFICATION, string>(
    TILE_ACTION_TYPES.DISMISS_NOTIFICATION,
  ),
  subscribeToSpotTile: action<TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE, string>(
    TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE,
  ),
  priceUpdateAction: action<TILE_ACTION_TYPES.SPOT_PRICES_UPDATE, SpotPriceTick>(
    TILE_ACTION_TYPES.SPOT_PRICES_UPDATE,
  ),
  priceHistoryReceieved: action<TILE_ACTION_TYPES.PRICE_HISTORY_RECEIVED, SpotPriceTick[], string>(
    TILE_ACTION_TYPES.PRICE_HISTORY_RECEIVED,
  ),
}

export type SpotTileActions = ActionUnion<typeof SpotTileActions>
