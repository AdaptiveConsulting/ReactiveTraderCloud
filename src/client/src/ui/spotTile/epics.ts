import * as _ from 'lodash'
import { combineEpics, ofType } from 'redux-observable'
import { from as observableFrom } from 'rxjs'
import { delay, filter, map, mergeMap, tap } from 'rxjs/operators'
import { ACTION_TYPES as PRICING_ACTION_TYPES } from '../../pricingOperations'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
import { ExecutionService, ReferenceDataService } from '../../services'
import { Direction } from '../../types'
import { SpotPrice } from '../../types/spotPrice'
import {
  ACTION_TYPES as SPOT_TILE_ACTION_TYPES,
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
const addCurrencyPairToSpotPrices = (
  referenceDataService: ReferenceDataService
) => (spotPrices: SpotPrices): SpotPrices => {
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
  executionService$: ExecutionService,
  referenceDataService: ReferenceDataService,
  openfin
) {
  function executeTradeEpic(action$) {
    return action$.pipe(
      ofType(SPOT_TILE_ACTION_TYPES.EXECUTE_TRADE),
      mergeMap((request: any) =>
        executionService$
          .executeTrade(request.payload)
          .pipe(map(result => ({ result, request })))
      ),
      map((x: any) => tradeExecuted(x.result, x.request.meta))
    )
  }

  function onPriceUpdateEpic(action$) {
    return action$.pipe(
      ofType(PRICING_ACTION_TYPES.SPOT_PRICES_UPDATE),
      map(extractPayload),
      map(addCurrencyPairToSpotPrices(referenceDataService)),
      map(updateTiles)
    )
  }

  function displayCurrencyChart(action$) {
    return action$.pipe(
      ofType(SPOT_TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART),
      mergeMap((payload: any) => {
        return observableFrom(
          payload.payload.openFin.displayCurrencyChart(payload.payload.symbol)
        )
      }),
      map(symbol => {
        return currencyChartOpened(symbol)
      })
    )
  }

  function onTradeExecuted(action$) {
    return action$.pipe(
      ofType(SPOT_TILE_ACTION_TYPES.TRADE_EXECUTED),
      tap((action: any) => {
        if (openfin.isRunningInOpenFin && action.meta) {
          openfin.sendPositionClosedNotification(
            action.meta.uuid,
            action.meta.correlationId
          )
        }
      }),
      delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
      map((action: any) => ({
        symbol: action.payload.trade.CurrencyPair || action.payload.trade.symbol
      })),
      map(dismissNotification)
    )
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
    return action$.pipe(
      ofType(REF_ACTION_TYPES.REFERENCE_SERVICE),
      tap(() => {
        openfin.addSubscription('close-position', (msg, uuid) => {
          const trade = createTrade(
            msg,
            store.getState().pricingService[msg.symbol]
          )
          store.dispatch(
            executeTrade(trade, { uuid, correlationId: msg.correlationId })
          )
        })
      }),
      filter(() => false)
    )
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
