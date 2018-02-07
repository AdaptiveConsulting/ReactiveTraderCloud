import { createAction } from 'redux-actions'
import { combineEpics } from 'redux-observable'
import { regionsSettings } from '../../regions/regionsOperations'
import { ACTION_TYPES as PRICING_ACTION_TYPES } from './pricingActions'

import * as _ from 'lodash'
import { Observable } from 'rxjs/Rx'
import { Direction } from '../../types'
import { ACTION_TYPES as REF_ACTION_TYPES } from './referenceDataActions'
import { SpotPrice } from '../../types/spotPrice'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 60000

interface SpotPrices {
  [symbol: string]: SpotPrice
}

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

const extractPayload = action => action.payload
const addCurrencyPairToSpotPrices = referenceDataService => (spotPrices: SpotPrices): SpotPrices => {
  return _.mapValues(spotPrices, (spotPrice: SpotPrice) => {
    return {
      ...spotPrice,
      currencyPair: spotPrice.currencyPair || referenceDataService.getCurrencyPair(spotPrice.symbol)
    }
  })
}

export function spotTileEpicsCreator(executionService$, referenceDataService, openfin) {
  function executeTradeEpic(action$) {
    return action$.ofType(ACTION_TYPES.EXECUTE_TRADE)
      .flatMap((action) => executionService$.executeTrade(action.payload), (request, result) => ({ request, result }))
      .map(x => tradeExecuted(x.result, x.request.meta))
  }

  function onPriceUpdateEpic(action$) {
    return action$.ofType(PRICING_ACTION_TYPES.SPOT_PRICES_UPDATE)
      .map(extractPayload)
      .map(addCurrencyPairToSpotPrices(referenceDataService))
      .map(updateTiles)
  }

  function displayCurrencyChart(action$) {
    return action$.ofType(ACTION_TYPES.DISPLAY_CURRENCY_CHART)
      .flatMap((payload) => {
        return Observable.fromPromise(payload.payload.openFin.displayCurrencyChart(payload.payload.symbol))
      })
      .map((symbol) => {
        return currencyChartOpened(symbol)
      })
  }

  function onTradeExecuted(action$) {
    return action$.ofType(ACTION_TYPES.TRADE_EXECUTED)
      .do(action => {
        openfin.isRunningInOpenFin && action.meta && openfin.sendPositionClosedNotification(action.meta.uuid, action.meta.correlationId)
      })
      .delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS)
      .map(action => ({ symbol: action.payload.trade.CurrencyPair || action.payload.trade.symbol }))
      .map(dismissNotification)
  }

  function createTrade(msg, price) {
    const direction = msg.amount > 0 ? Direction.Sell : Direction.Buy
    const notional = Math.abs(msg.amount)

    const spotRate = direction === Direction.Buy
      ? price.ask
      : price.bid

    return {
      CurrencyPair: price.symbol,
      SpotRate: spotRate,
      Direction: direction,
      Notional: notional,
      DealtCurrency: price.currencyPair.base,
    }
  }

  function closePositionEpic(action$, store) {
    return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
      .do(() => {
        openfin.addSubscription('close-position', (msg, uuid) => {
          const trade = createTrade(msg, store.getState().pricingService[msg.symbol])
          store.dispatch(executeTrade(trade, { uuid, correlationId: msg.correlationId }))
        })
      })
      .filter(() => false)
  }

  return combineEpics(executeTradeEpic, onPriceUpdateEpic, displayCurrencyChart, onTradeExecuted, closePositionEpic)
}
