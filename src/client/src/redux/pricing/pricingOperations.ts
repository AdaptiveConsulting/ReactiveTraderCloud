import { Observable } from 'rxjs/Rx';
import { createAction } from 'redux-actions';

import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations'

export enum ACTION_TYPES {
  PRICING_SERVICE = '@ReactiveTraderCloud/PRICING_SERVICE'
}

export const fetchPricing = createAction(ACTION_TYPES.PRICING_SERVICE)

const getCurrencyPairs = (symbols: Array<string>, pricingService$: any) => {
  return Observable.from(symbols).mergeMap(symbol => pricingService$.getSpotPriceStream({ symbol }))
}

const accumulatePrices = (acc, tick, index) => {
  if (index === 0) {
    return { [tick.symbol]: tick }
  }
  return {
    ...acc,
    [tick.symbol]: tick
  }
}

export const pricingServiceEpic = pricingService$ => (action$) => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .map(action => action.payload.currencyPairUpdates.map(currency => currency.currencyPair.symbol))
    .mergeMap((symbols: Array<string>) => getCurrencyPairs(symbols, pricingService$))
    .scan(accumulatePrices)
    .map(fetchPricing)
}

export const pricingServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.PRICING_SERVICE:
      return action.payload
    default:
      return state
  }
}
