import { Observable } from 'rxjs/Rx'
import { createAction } from 'redux-actions'

import { ACTION_TYPES as REF_ACTION_TYPES } from './referenceOperations'
import { stalePricing, PRICE_STALE_AFTER_X_IN_MS } from './ui/spotTile/spotTileOperations'
import { combineEpics } from 'redux-observable'

export enum ACTION_TYPES {
  PRICING_SERVICE = '@ReactiveTraderCloud/PRICING_SERVICE',
  PRICING_SERVICE_STATUS_UPDATE = '@ReactiveTraderCloud/PRICING_SERVICE_STATUS_UPDATE',
}

export const fetchPricing = createAction(ACTION_TYPES.PRICING_SERVICE)
export const pricingStatusUpdate = createAction(ACTION_TYPES.PRICING_SERVICE_STATUS_UPDATE)

const getCurrencyPairs = (symbols: Array<string>, pricingService$: any) => {
  return Observable.from(symbols).mergeMap(symbol => pricingService$.getSpotPriceStream({ symbol }))
}

const accumulatePrices = (acc, tick, index) => {
  return {
    ...acc,
    [tick.symbol]: tick,
  }
}

export const pricingServiceEpic = (pricingService$, openFin, referenceDataService) => {

  const pricingStream$ = action$ => action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .map(action => action.payload.currencyPairUpdates.map(currency => currency.currencyPair.symbol))

  function stalePriceCheck(action$) {
    return pricingStream$(action$)
      .mergeMap((symbols: Array<string>) => {
        return Observable.from(symbols)
          .mergeMap(symbol => pricingService$.getSpotPriceStream({ symbol })
            .debounce(() => Observable.interval(PRICE_STALE_AFTER_X_IN_MS))
            .map(stalePricing))
      })
  }

  function getPrices(action$, store) {
    return pricingStream$(action$)
      .mergeMap((symbols: Array<string>) => getCurrencyPairs(symbols, pricingService$))
      .do( price => {
        const update = {...price, ratePrecision: referenceDataService.getCurrencyPair(price.symbol).ratePrecision }
        openFin.publishPrice(update)
      })
      .scan(accumulatePrices, {}).map(fetchPricing)
  }

  function subscribeToConnectionStatus(action$) {
    return pricingStream$(action$)
      .flatMap(item => pricingService$.serviceStatusStream)
      .map(pricingStatusUpdate)
  }

  return combineEpics(getPrices, stalePriceCheck, subscribeToConnectionStatus)
}

export const pricingServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.PRICING_SERVICE:
      return action.payload
    default:
      return state
  }
}
