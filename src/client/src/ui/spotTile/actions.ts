import { action, ActionUnion } from 'rt-util'
import { ExecuteTradeRequest, ExecuteTradeResponse } from './model/executeTradeRequest'
import { SpotPriceTick } from './model/spotPriceTick'
import { TradeExectionMeta } from './model/spotTileUtils'

export enum TILE_ACTION_TYPES {
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED',
  DISPLAY_CURRENCY_CHART = '@ReactiveTraderCloud/DISPLAY_CURRENCY_CHART',
  CURRENCY_CHART_OPENED = '@ReactiveTraderCloud/CURRENCY_CHART_OPENED',
  DISMISS_NOTIFICATION = '@ReactiveTraderCloud/DISMISS_NOTIFICATION',
  SHOW_SPOT_TILE = '@ReactiveTraderCloud/SHOW_SPOT_TILE',
  SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE'
}

export const SpotTileActions = {
  executeTrade: action<TILE_ACTION_TYPES.EXECUTE_TRADE, ExecuteTradeRequest, TradeExectionMeta | null>(
    TILE_ACTION_TYPES.EXECUTE_TRADE
  ),
  tradeExecuted: action<TILE_ACTION_TYPES.TRADE_EXECUTED, ExecuteTradeResponse, TradeExectionMeta | null>(
    TILE_ACTION_TYPES.TRADE_EXECUTED
  ),
  displayCurrencyChart: action<TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART, string>(
    TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART
  ),
  currencyChartOpened: action<TILE_ACTION_TYPES.CURRENCY_CHART_OPENED, string>(TILE_ACTION_TYPES.CURRENCY_CHART_OPENED),
  dismissNotification: action<TILE_ACTION_TYPES.DISMISS_NOTIFICATION, string>(TILE_ACTION_TYPES.DISMISS_NOTIFICATION),
  showSpotTile: action<TILE_ACTION_TYPES.SHOW_SPOT_TILE, string>(TILE_ACTION_TYPES.SHOW_SPOT_TILE),
  priceUpdateAction: action<TILE_ACTION_TYPES.SPOT_PRICES_UPDATE, SpotPriceTick>(TILE_ACTION_TYPES.SPOT_PRICES_UPDATE)
}

export type SpotTileActions = ActionUnion<typeof SpotTileActions>
