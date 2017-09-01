import { Observable } from 'rxjs/Rx'
import { createAction } from 'redux-actions'

import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations'
import {stalePricing, PRICE_STALE_AFTER_X_IN_MS} from "../spotTile/spotTileOperations"
import {combineEpics} from "redux-observable";

export enum ACTION_TYPES {
  PRICING_SERVICE = '@ReactiveTraderCloud/PRICING_SERVICE',
}

export const fetchPricing = createAction(ACTION_TYPES.PRICING_SERVICE)

const getCurrencyPairs = (symbols: Array<string>, pricingService$: any) => {
  return Observable.from(symbols).mergeMap(symbol => pricingService$.getSpotPriceStream({ symbol }))
}

const accumulatePrices = (acc, tick, index) => {
  return {
    ...acc,
    [tick.symbol]: tick,
  }
}

export const pricingServiceEpic = (pricingService$) => {

  const pricingStream$ = action$ => action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .map(action => action.payload.currencyPairUpdates.map(currency => currency.currencyPair.symbol))

  function stalePriceCheck(action$) {
    return pricingStream$(action$)
      .mergeMap((symbols: Array<string>) => {
        return Observable.from(symbols)
          .mergeMap(symbol => pricingService$.getSpotPriceStream({symbol})
            .debounce(() => Observable.interval(PRICE_STALE_AFTER_X_IN_MS))
            .map(stalePricing))
      })
  }

  function getPrices(action$) {
    return pricingStream$(action$)
      .mergeMap((symbols: Array<string>) => getCurrencyPairs(symbols, pricingService$))
      .scan(accumulatePrices, {}).map(fetchPricing)
  }

  return combineEpics(getPrices, stalePriceCheck)
}

export const pricingServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.PRICING_SERVICE:
      return action.payload
    default:
      return state
  }
}
