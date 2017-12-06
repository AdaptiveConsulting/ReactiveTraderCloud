import { createAction } from 'redux-actions'
import { combineEpics } from 'redux-observable'
import { regionsSettings } from '../../regions/regionsOperations'
import { ACTION_TYPES as PRICING_ACTION_TYPES } from '../../pricingOperations'
import { timeFormat } from 'd3-time-format'
import * as numeral from 'numeral'
import * as _ from 'lodash'
import { Observable } from 'rxjs/Rx'
import { Direction, NotificationType, PriceMovementTypes, Rate } from '../../types'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceOperations'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000
export const PRICE_STALE_AFTER_X_IN_MS = 6000

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
  priceStale: boolean,
  isTradeExecutionInFlight: boolean,
  notification: any,
  pricingConnected: boolean,
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
  PRICING_STALE = '@ReactiveTraderCloud/PRICING_STALE',
}

const stalePriceErrorMessage = 'Pricing is unavailable'

export const executeTrade = createAction(ACTION_TYPES.EXECUTE_TRADE, payload => payload, (payload, meta) => meta)
export const tradeExecuted = createAction(ACTION_TYPES.TRADE_EXECUTED, payload => payload, (payload, meta) => meta)
export const undockTile = createAction(ACTION_TYPES.UNDOCK_TILE, payload => payload)
export const tileUndocked = createAction(ACTION_TYPES.TILE_UNDOCKED, payload => payload)
export const displayCurrencyChart = createAction(ACTION_TYPES.DISPLAY_CURRENCY_CHART, payload => payload)
export const currencyChartOpened = createAction(ACTION_TYPES.CURRENCY_CHART_OPENED, payload => payload)
export const updateTiles = createAction(ACTION_TYPES.UPDATE_TILES)
export const dismissNotification = createAction(ACTION_TYPES.DISMISS_NOTIFICATION, payload => payload)
export const stalePricing = createAction(ACTION_TYPES.PRICING_STALE)

export const spotRegionSettings = id => regionsSettings(`${id} Spot`, 370, 155, true)

export function spotTileEpicsCreator(executionService$, referenceDataService$, openfin) {
  function executeTradeEpic(action$) {
    return action$.ofType(ACTION_TYPES.EXECUTE_TRADE)
      .flatMap((action) => executionService$.executeTrade(action.payload),
        (request, result) => ({request, result}))
      .map(x => tradeExecuted(x.result, x.request.meta))
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
      .map(action => action.payload)
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
      .map(action => ({symbol: action.payload.trade.CurrencyPair || action.payload.trade.currencyPair.symbol}))
      .map(dismissNotification)
  }

  function createTrade(msg, price) {
    const direction = msg.amount > 0 ? Direction.Sell : Direction.Buy;
    const notional = Math.abs(msg.amount);

    const spotRate = direction == Direction.Buy
      ? price.ask
      : price.bid;

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
        openfin.addSubscription('close-position',
          (msg, uuid) => {
            const trade = createTrade( msg, store.getState().pricingService[msg.symbol])
            store.dispatch(executeTrade(trade, {uuid, correlationId: msg.correlationId}))
          })
      })
      .filter(() => false)
  }

  return combineEpics(executeTradeEpic, onPriceUpdateEpic, displayCurrencyChart, onTradeExecuted, closePositionEpic)
}

const changeValueInState = (state, symbol, flagKey, value) => {
  const target = _.pick(state, symbol)
  if (target.hasOwnProperty(symbol) && target[symbol].hasOwnProperty(flagKey)) {
    target[symbol][flagKey] = value
  }
  return _.assign(state, target)
}

export const spotTileReducer = (state: any = {}, {type, payload}) => {
  switch (type) {
    case ACTION_TYPES.UPDATE_TILES:
      // TODO: prices shoould not update while execution is in progress
      return _.values(payload).reduce(spotTileAccumulator(state), {})
    case ACTION_TYPES.DISPLAY_CURRENCY_CHART:
      return changeValueInState(state, payload.symbol, 'currencyChartIsOpening', true)
    case ACTION_TYPES.CURRENCY_CHART_OPENED:
      return changeValueInState(state, payload.symbol, 'currencyChartIsOpening', false)
    case ACTION_TYPES.EXECUTE_TRADE:
      return changeValueInState(state, payload.CurrencyPair, 'isTradeExecutionInFlight', true)
    case ACTION_TYPES.TRADE_EXECUTED:
      const response = payload
      const symbol = response.hasError ? response.trade.CurrencyPair : response.trade.currencyPair.symbol
      const item = state[symbol]
      item.hasError = response.hasError
      item.isTradeExecutionInFlight = false
      item.notification = buildNotification(response.trade, response.error)
      return state
    case ACTION_TYPES.DISMISS_NOTIFICATION:
      return changeValueInState(state, payload.symbol, 'notification', null)
    case ACTION_TYPES.PRICING_STALE:
      const stalePrice = _.pick(state, payload.symbol)
      if (stalePrice) {
        stalePrice[payload.symbol].priceStale = true
        stalePrice[payload.symbol].notification = buildNotification({}, stalePriceErrorMessage)
        return _.assign(state, stalePrice)
      }
      return state
    case PRICING_ACTION_TYPES.PRICING_SERVICE_STATUS_UPDATE:
      return _.mapValues(state, (item) => {
        const newItem: SpotPrice = _.clone(item)
        newItem.pricingConnected = payload.isConnected
        newItem.notification = buildNotification({}, stalePriceErrorMessage)
        return newItem
      })
    default:
      return state
  }
}

function isPriceStale(prevItem, item) {
  return prevItem && prevItem.hasOwnProperty('priceStale') &&
    item.creationTimestamp === prevItem.creationTimestamp &&
    prevItem.priceStale === true
}

function spotTileAccumulator(state) {
  return function (acc, el, index) {
    acc[el.symbol] = spotTileItemFormatter(state, el)
    return acc
  }
}

function getNotification(prevItem, item) {
  if (prevItem) {
    if (!prevItem.notification ||
      (!isPriceStale(prevItem, item) && prevItem.notification.message === stalePriceErrorMessage)) {
      return null
    }
    return prevItem.notification
  }
  return null
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
    priceMovementType: setPriceMovement(prevItem, mid),
    spread: getSpread(item.bid, item.ask, pipsPosition, ratePrecision),
    isTradable: item.isTradable,
    priceStale: isPriceStale(prevItem, item),
    isTradeExecutionInFlight: prevItem ? prevItem.isTradeExecutionInFlight : false,
    notification: getNotification(prevItem, item),
    pricingConnected: prevItem ? prevItem.pricingConnected : true,
  }
}

function setPriceMovement(prevItem, mid) {
  if (!prevItem) {
    return PriceMovementTypes.None
  }

  const priceMovement = getPriceMovementType(prevItem.mid.rawRate, mid.rawRate)

  if (priceMovement === PriceMovementTypes.None) {
    return prevItem.priceMovementType
  } else {
    return priceMovement
  }
}

function getPriceMovementType(lastPrice: any, nextPrice: any) {
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
    return {message: error, hasError: true, notificationType: NotificationType.Text}
  }

  return {
    notificationType: NotificationType.Trade,
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
