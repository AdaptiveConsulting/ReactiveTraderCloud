import { from as observableFrom } from 'rxjs'
import * as _ from 'lodash'
import { combineEpics } from 'redux-observable'
import { Observable } from 'rxjs/Rx'
import { ACTION_TYPES as PRICING_ACTION_TYPES } from '../../pricingOperations'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
import { Direction } from '../../types'
import { SpotPrice } from '../../types/spotPrice'
import { ACTION_TYPES as SPOT_TILE_ACTION_TYPES } from './actions'
import {
  currencyChartOpened,
  dismissNotification,
  executeTrade,
  tradeExecuted,
  updateTiles
} from './actions'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

interface SpotPrices {
  [symbol: string]: SpotPrice
}

const extractPayload = action => action.payload
const addCurrencyPairToSpotPrices = referenceDataService => (
  spotPrices: SpotPrices
): SpotPrices => {
  return _.mapValues(spotPrices, (spotPrice: SpotPrice) => {
    return {
      ...spotPrice,
      currencyPair:
        spotPrice.currencyPair ||
        referenceDataService.getCurrencyPair(spotPrice.symbol)
    }
  })
}

export function spotTileEpicsCreator(
  executionService$,
  referenceDataService,
  openfin
) {
  function executeTradeEpic(action$) {
    return action$
      .ofType(SPOT_TILE_ACTION_TYPES.EXECUTE_TRADE)
      .flatMap(
        action => executionService$.executeTrade(action.payload),
        (request, result) => ({ request, result })
      )
      .map(x => tradeExecuted(x.result, x.request.meta))
  }

  function onPriceUpdateEpic(action$) {
    return action$
      .ofType(PRICING_ACTION_TYPES.SPOT_PRICES_UPDATE)
      .map(extractPayload)
      .map(addCurrencyPairToSpotPrices(referenceDataService))
      .map(updateTiles)
  }

  function displayCurrencyChart(action$) {
    return action$
      .ofType(SPOT_TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART)
      .flatMap(payload => {
        return observableFrom(
          payload.payload.openFin.displayCurrencyChart(payload.payload.symbol)
        )
      })
      .map(symbol => {
        return currencyChartOpened(symbol)
      })
  }

  function onTradeExecuted(action$) {
    return action$
      .ofType(SPOT_TILE_ACTION_TYPES.TRADE_EXECUTED)
      .do(action => {
        if (openfin.isRunningInOpenFin && action.meta) {
          openfin.sendPositionClosedNotification(
            action.meta.uuid,
            action.meta.correlationId
          )
        }
      })
      .delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS)
      .map(action => ({
        symbol: action.payload.trade.CurrencyPair || action.payload.trade.symbol
      }))
      .map(dismissNotification)
  }

  function createTrade(msg, price) {
    const direction = msg.amount > 0 ? Direction.Sell : Direction.Buy
    const notional = Math.abs(msg.amount)

    const spotRate = direction === Direction.Buy ? price.ask : price.bid

    return {
      CurrencyPair: price.symbol,
      SpotRate: spotRate,
      Direction: direction,
      Notional: notional,
      DealtCurrency: price.currencyPair.base
    }
  }

  function closePositionEpic(action$, store) {
    return action$
      .ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
      .do(() => {
        openfin.addSubscription('close-position', (msg, uuid) => {
          const trade = createTrade(
            msg,
            store.getState().pricingService[msg.symbol]
          )
          store.dispatch(
            executeTrade(trade, { uuid, correlationId: msg.correlationId })
          )
        })
      })
      .filter(() => false)
  }

  return combineEpics(
    executeTradeEpic,
    onPriceUpdateEpic,
    displayCurrencyChart,
    onTradeExecuted,
    closePositionEpic
  )
}

export default spotTileEpicsCreator
