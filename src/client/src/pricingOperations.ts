import * as _ from 'lodash'
import * as keyBy from 'lodash.keyby'
import { createAction } from 'redux-actions'
import { combineEpics, ofType } from 'redux-observable'
import { from as observableFrom } from 'rxjs'
import {
  debounceTime,
  map,
  mergeMap,
  scan,
  takeLast,
  tap
} from 'rxjs/operators'
import { ACTION_TYPES as REF_ACTION_TYPES } from './referenceDataOperations'
import { PricingService, ReferenceDataService } from './services'
import { PriceMovementTypes, SpotPriceTick } from './types'
import { buildNotification } from './ui/notification/notificationUtils'

export enum ACTION_TYPES {
  SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE',
  PRICING_STALE = '@ReactiveTraderCloud/PRICING_STALE'
}

export const createSpotPricesUpdateAction = createAction(
  ACTION_TYPES.SPOT_PRICES_UPDATE
)

export const createStalePriceAction = createAction(ACTION_TYPES.PRICING_STALE)

// Epics Logic
const MS_FOR_LAST_PRICE_TO_BECOME_STALE = 6000

interface PricesBySymbol {
  [symbol: string]: SpotPriceTick
}

const reducePrices = (
  acc: PricesBySymbol,
  tick: SpotPriceTick
): PricesBySymbol => {
  return {
    ...acc,
    [tick.symbol]: tick
  }
}

const getSymbol = (currency): string => currency.currencyPair.symbol
const getSymbols = (action): string[] =>
  action.payload.currencyPairUpdates.map(getSymbol)
// returns a stream that emits an array containing the currencyPairSymbols like this: `["EURUSD", ...]`
const getSymbolArray$ = action$ =>
  action$.pipe(ofType(REF_ACTION_TYPES.REFERENCE_SERVICE), map(getSymbols))
// returns a stream that emits each currencyPairSymbol individually. Example: `EURUSD`
const getSymbol$ = action$ =>
  getSymbolArray$(action$).pipe(
    mergeMap((symbols: string[]) => observableFrom(symbols))
  )

const publishPriceToOpenFin = openFin => price => openFin.publishPrice(price)
const addRatePrecisionToPrice = (
  referenceDataService: ReferenceDataService
) => price => {
  return {
    ...price,
    ratePrecision: referenceDataService.getCurrencyPair(price.symbol)
      .ratePrecision
  }
}

// Creates a stream that only start emitting new prices after `REFERENCE_SERVICE` action is received.
// Also only emits for symbols specified in `REFERENCE_SERVICE`.
const priceForReferenceServiceSymbols$ = (
  action$,
  pricingService$: PricingService
) => {
  // For each symbol
  return (
    getSymbol$(action$)
      // get a new price stream for that symbol
      .pipe(
        mergeMap((symbol: any) =>
          pricingService$.getSpotPriceStream({ symbol })
        )
      )
  )
}

export const pricingServiceEpic = (
  pricingService$: PricingService,
  openFin,
  referenceDataService: ReferenceDataService
) => {
  const stalePriceEpic = action$ => {
    // For each symbol
    return getSymbol$(action$).pipe(
      // creates a new price stream and will wait to debounce
      mergeMap((symbol: string) =>
        pricingService$
          .getSpotPriceStream({ symbol })
          .pipe(debounceTime(MS_FOR_LAST_PRICE_TO_BECOME_STALE))
      ),
      // when debounces, it creates an action
      map(createStalePriceAction)
    )
  }

  const publishPriceToOpenFinEpic = action$ => {
    return priceForReferenceServiceSymbols$(action$, pricingService$).pipe(
      map(addRatePrecisionToPrice(referenceDataService)),
      tap(publishPriceToOpenFin(openFin)),
      // Hack to never emit any actions, because we don't need any action.
      takeLast(1)
    )
  }

  const updatePricesEpic = action$ => {
    return priceForReferenceServiceSymbols$(action$, pricingService$).pipe(
      scan(reducePrices, {}),
      map(createSpotPricesUpdateAction)
    )
  }

  return combineEpics(
    updatePricesEpic,
    stalePriceEpic,
    publishPriceToOpenFinEpic
  )
}

// Reducer Logic
const stalePriceErrorMessage = 'Pricing is unavailable'

function getPriceMovementType(prevItem: any, newItem: any) {
  const prevPriceMove = prevItem.priceMovementType || PriceMovementTypes.None
  const lastPrice = prevItem.mid
  const nextPrice = newItem.mid
  if (lastPrice < nextPrice) {
    return PriceMovementTypes.Up
  }
  if (lastPrice > nextPrice) {
    return PriceMovementTypes.Down
  }
  return prevPriceMove
}

interface PricingOperationsReducerState {
  [symbol: string]: SpotPriceTick
}

export const pricingServiceReducer = (
  state: PricingOperationsReducerState = {},
  action
): PricingOperationsReducerState => {
  const { type, payload } = action
  switch (type) {
    case ACTION_TYPES.SPOT_PRICES_UPDATE:
      const updatedPrices = keyBy(action.payload, 'symbol')
      const updatedPricesDataObj = {}

      _.forOwn(updatedPrices, (value, key) => {
        const prevItem = state[key] || {}
        const newItem: SpotPriceTick = { ...value }
        newItem.priceStale = false
        newItem.priceMovementType = getPriceMovementType(prevItem, newItem)
        updatedPricesDataObj[key] = newItem
      })

      return { ...state, ...updatedPricesDataObj }
    case ACTION_TYPES.PRICING_STALE:
      return {
        ...state,
        [payload.symbol]: {
          ...state[payload.symbol],
          priceStale: true,
          notification: buildNotification(null, stalePriceErrorMessage)
        }
      }
    default:
      return state
  }
}
