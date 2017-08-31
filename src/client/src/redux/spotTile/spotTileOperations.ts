import { createAction } from 'redux-actions'
import { combineEpics } from 'redux-observable'
import { regionsSettings } from '../regions/regionsOperations'
import { ACTION_TYPES as PRICING_ACTION_TYPES } from '../pricing/pricingOperations'
import { timeFormat } from 'd3-time-format'
import * as numeral from 'numeral'
import * as _ from 'lodash'
import { Observable } from 'rxjs/Rx'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000
export interface Rate {
  bigFigure: number
  rawRate: number
  ratePrecision: number
  pipFraction: number
  pipPrecision: number
  pips: number
}

export enum Direction {
  Sell = 'Sell',
  Buy = 'Buy',
}

export enum PriceMovementTypes {
  Up = 'Up',
  Down = 'Down',
  None = 'None',
}

export interface SpotPrice {
  currencyPair: any
  symbol: any
  ratePrecision: number
  currencyChartIsOpening: boolean
  bid: Rate
  ask: Rate
  mid: Rate
  valueDate: Date
  creationTimestamp: Date
  priceMovementType: PriceMovementTypes
  spread: {
    value: number
    formattedValue: string,
  }
  isTradable: boolean,
  isTradeExecutionInFlight: boolean,
  notification: any,
}

export enum ACTION_TYPES {
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED',
  UNDOCK_TILE = '@ReactiveTraderCloud/UNDOCK_TILE',
  TILE_UNDOCKED = '@ReactiveTraderCloud/TILE_UNDOCKED',
  DISPLAY_CURRENCY_CHART = '@ReactiveTraderCloud/DISPLAY_CURRENCY_CHART',
  CURRENCY_CHART_OPENED = '@ReactiveTraderCloud/CURRENCY_CHART_OPENED',
  UPDATE_TILES = '@ReactiveTraderCloud/UPDATE_TILES',
  DISMISS_NOTIFICATION = '@ReactiveTraderCloud/DISMISS_NOTIFICATION',
}

export const executeTrade = createAction(ACTION_TYPES.EXECUTE_TRADE, payload => payload)
export const tradeExecuted = createAction(ACTION_TYPES.TRADE_EXECUTED)
export const undockTile = createAction(ACTION_TYPES.UNDOCK_TILE, payload => payload)
export const tileUndocked = createAction(ACTION_TYPES.TILE_UNDOCKED, payload => payload)
export const displayCurrencyChart = createAction(ACTION_TYPES.DISPLAY_CURRENCY_CHART, payload => payload)
export const currencyChartOpened = createAction(ACTION_TYPES.CURRENCY_CHART_OPENED, payload => payload)
export const updateTiles = createAction(ACTION_TYPES.UPDATE_TILES)
export const dismissNotification = createAction(ACTION_TYPES.DISMISS_NOTIFICATION, payload => payload)

export const spotRegionSettings = id => regionsSettings(`${id} Spot`, 370, 155, true)

export function spotTileEpicsCreator(executionService$, pricingService$, referenceDataService$) {
  function executeTradeEpic(action$) {
    return action$.ofType(ACTION_TYPES.EXECUTE_TRADE)
      .flatMap((action) => {
        return executionService$.executeTrade(action.payload)
      })
      .map(tradeExecuted)
  }

  function onPriceUpdateEpic(action$) {
    return action$.ofType(PRICING_ACTION_TYPES.PRICING_SERVICE)
      .map((payload) => {
        _.values(payload.payload).forEach((item: SpotPrice) => {
          // TODO: do it better
          item.currencyPair = item.currencyPair || referenceDataService$.getCurrencyPair(item.symbol)
        })
        return payload
      })
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
      .debounceTime(DISMISS_NOTIFICATION_AFTER_X_IN_MS)
      .map(action => ({ symbol: action.payload.trade.currencyPair.symbol }))
      .map(dismissNotification)
  }

  return combineEpics(executeTradeEpic, onPriceUpdateEpic, displayCurrencyChart, onTradeExecuted)
}

export const spotTileReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_TILES:
      // TODO: prices shoould not update while execution is in progress
      return action.payload.payload && _.values(action.payload.payload).reduce(spotTileAccumulator(state), {})
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      state[action.payload.symbol].currencyChartIsOpening = true
      return state
    case ACTION_TYPES.CURRENCY_CHART_OPENED:
      state[action.payload].currencyChartIsOpening = false
      return state
    case ACTION_TYPES.EXECUTE_TRADE:
      state[action.payload.CurrencyPair].isTradeExecutionInFlight = true
      return state
    case ACTION_TYPES.TRADE_EXECUTED:
      const response = action.payload
      const symbol = response.hasError ? response.trade.CurrencyPair : response.trade.currencyPair.symbol
      const item = state[symbol]

      item.hasError = response.hasError
      item.isTradeExecutionInFlight = false
      item.notification = buildNotification(response.trade, response.error)
      return state
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      state[action.payload.symbol].notification = null
      return state
    default:
      return state
  }
}

function spotTileAccumulator(state) {
  return function (acc, el, index) {
    acc[el.symbol] = spotTileItemFormatter(state, el)
    return acc
  }
}

// use priceMapper as a source of this reducer
function spotTileItemFormatter(state, item): SpotPrice {
  const prevItem = state[item.symbol]
  // TEMP: get from currency pair
  const ratePrecision = item.currencyPair.ratePrecision
  const pipsPosition = item.currencyPair.pipsPosition
  const mid = toRate(item.mid, ratePrecision, pipsPosition)

  return {
    mid,
    ratePrecision,
    currencyChartIsOpening: prevItem ? prevItem.currencyChartIsOpening : false,
    currencyPair: prevItem ? prevItem.currencyPair : null,
    symbol: item.symbol,
    bid: toRate(item.bid, ratePrecision, pipsPosition),
    ask: toRate(item.ask, ratePrecision, pipsPosition),
    valueDate: item.valueDate,
    creationTimestamp: item.creationTimestamp,
    priceMovementType: prevItem ? getPriceMovementType(prevItem.mid.rawRate, mid.rawRate) : PriceMovementTypes.None,
    spread: getSpread(item.bid, item.ask, pipsPosition, ratePrecision),
    isTradable: item.isTradable,
    isTradeExecutionInFlight: prevItem ? prevItem.isTradeExecutionInFlight : false,
    notification: prevItem ? prevItem.notification : null,
  }
}

function getPriceMovementType(lastPrice: any, nextPrice: any) {
  if (lastPrice === null) {
    return PriceMovementTypes.None
  }
  if (lastPrice < nextPrice) {
    return PriceMovementTypes.Up
  }
  if (lastPrice > nextPrice) {
    return PriceMovementTypes.Down
  }
  return PriceMovementTypes.None
}

function getSpread(bid: number, ask: number, pipsPosition: number, ratePrecision: number) {
  const spread = (ask - bid) * Math.pow(10, pipsPosition)
  const toFixedPrecision = spread.toFixed(ratePrecision - pipsPosition)
  return {
    value: Number(toFixedPrecision),
    formattedValue: toFixedPrecision,
  }
}

export function toRate(rawRate: number, ratePrecision: number, pipPrecision: number): Rate {
  const rateString = rawRate.toFixed(ratePrecision)
  const priceParts = rateString.split('.')
  const wholeNumber = priceParts[0]
  const fractions = priceParts[1]

  return {
    rawRate,
    ratePrecision,
    pipPrecision,
    bigFigure: Number(wholeNumber + '.' + fractions.substring(0, pipPrecision - 2)),
    pips: Number(fractions.substring(pipPrecision - 2, pipPrecision)),
    pipFraction: Number(fractions.substring(pipPrecision, pipPrecision + 1)),
  }
}

function buildNotification(trade, error) {
  if (error) {
    return { message: error, hasError: true, notificationType: 'Text' }
  }

  return {
    notificationType: 'Trade',
    hasError: false,
    direction: trade.direction === Direction.Sell ? 'Sold' : 'Bought',
    notional: numeral(trade.notional).format('0,000,000[.]00'),
    status: trade.status,
    dealtCurrency: trade.currencyPair.base,
    termsCurrency: trade.currencyPair.terms,
    spotRate: trade.spotRate,
    formattedValueDate: `SP. ${timeFormat('%b %e')(trade.valueDate)}`,
    tradeId: trade.tradeId,
  }
}
