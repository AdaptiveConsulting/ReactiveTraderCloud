import { createAction } from 'redux-actions'
import { regionsSettings } from '../common/regions/regionsOperations'

export enum ACTION_TYPES {
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED',
  UNDOCK_TILE = '@ReactiveTraderCloud/UNDOCK_TILE',
  TILE_UNDOCKED = '@ReactiveTraderCloud/TILE_UNDOCKED',
  DISPLAY_CURRENCY_CHART = '@ReactiveTraderCloud/DISPLAY_CURRENCY_CHART',
  CURRENCY_CHART_OPENED = '@ReactiveTraderCloud/CURRENCY_CHART_OPENED',
  UPDATE_TILES = '@ReactiveTraderCloud/UPDATE_TILES',
  DISMISS_NOTIFICATION = '@ReactiveTraderCloud/DISMISS_NOTIFICATION'
}

export const executeTrade = createAction(ACTION_TYPES.EXECUTE_TRADE, payload => payload, (payload, meta) => meta)
export const tradeExecuted = createAction(ACTION_TYPES.TRADE_EXECUTED, payload => payload, (payload, meta) => meta)
export const undockTile = createAction(ACTION_TYPES.UNDOCK_TILE, payload => payload)
export const tileUndocked = createAction(ACTION_TYPES.TILE_UNDOCKED, payload => payload)
export const displayCurrencyChart = createAction(ACTION_TYPES.DISPLAY_CURRENCY_CHART, payload => payload)
export const currencyChartOpened = createAction(ACTION_TYPES.CURRENCY_CHART_OPENED, payload => payload)
export const updateTiles = createAction(ACTION_TYPES.UPDATE_TILES)
export const dismissNotification = createAction(ACTION_TYPES.DISMISS_NOTIFICATION, payload => payload)

export const spotRegionSettings = id => regionsSettings(`${id} Spot`, 370, 155, true)

