import { createAction } from 'redux-actions'
import { regionsSettings } from '../regions/regionsOperations'

export enum ACTION_TYPES {
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED',
  UNDOCK_TILE = '@ReactiveTraderCloud/UNDOCK_TILE',
  TILE_UNDOCKED = '@ReactiveTraderCloud/TILE_UNDOCKED',
  DISPLAY_CURRENCY_CHART = '@ReactiveTraderCloud/DISPLAY_CURRENCY_CHART',
  CURRENCY_CHART_OPENED = '@ReactiveTraderCloud/CURRENCY_CHART_OPENED',
}

export const executeTrade = createAction(ACTION_TYPES.EXECUTE_TRADE, payload => payload)
export const tradeExecuted = createAction(ACTION_TYPES.TRADE_EXECUTED)
export const undockTile = createAction(ACTION_TYPES.UNDOCK_TILE, payload => payload)
export const tileUndocked = createAction(ACTION_TYPES.TILE_UNDOCKED, payload => payload)
export const displayCurrencyChart = createAction(ACTION_TYPES.DISPLAY_CURRENCY_CHART, payload => payload)

export const spotRegionSettings = id => regionsSettings(`${id} Spot`, 370, 155, true)

export const executionServiceEpic = executionService$ => (action$) => {
  return action$.ofType(ACTION_TYPES.EXECUTE_TRADE)
    .flatMap((action) => {
      return executionService$.executeTrade(action.payload)
    })
    .map(tradeExecuted)
}

export const spotTileReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      action.payload.openFin.displayCurrencyChart(action.payload.symbol)
      return state
    case ACTION_TYPES.CURRENCY_CHART_OPENED:
      console.log('CURRENCY_CHART_OPENED: ', action.payload)
      return state
    default:
      return state
  }
}

