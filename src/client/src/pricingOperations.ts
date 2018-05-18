import * as _ from 'lodash'
import * as keyBy from 'lodash.keyby'
import { Action, createAction } from 'redux-actions'
import { combineEpics, ofType } from 'redux-observable'
import { from as observableFrom } from 'rxjs'
import { filter, map, mergeMap, scan, takeUntil } from 'rxjs/operators'
import { DISCONNECT_SERVICES } from './connectionActions'
import { ACTION_TYPES as REF_ACTION_TYPES } from './referenceDataOperations'
import { PricingService, ReferenceDataService } from './services'
import { OpenFin } from './services/openFin'
import { SpotPriceTick } from './types'
import { CurrencyPair } from './types/currencyPair'
import { buildNotification } from './ui/notification/notificationUtils'

export enum ACTION_TYPES {
  SPOT_PRICES_UPDATE = '@ReactiveTraderCloud/SPOT_PRICES_UPDATE'
}

export const createSpotPricesUpdateAction = createAction(
  ACTION_TYPES.SPOT_PRICES_UPDATE
)

// Epics Logic

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

// returns a stream that emits an array containing the currencyPairSymbols like this: `["EURUSD", ...]`
const getSymbolArray$ = action$ =>
  action$.pipe(
    ofType(REF_ACTION_TYPES.REFERENCE_SERVICE),
    map((x: Action<Map<string, CurrencyPair>>) => {
      return Array.from(x.payload.values()).map((y: any) => y.symbol)
    })
  )
// returns a stream that emits each currencyPairSymbol individually. Example: `EURUSD`
const getSymbol$ = action$ =>
  getSymbolArray$(action$).pipe(
    mergeMap((symbols: string[]) => observableFrom(symbols))
  )

const publishPriceToOpenFin = (openFin: OpenFin) => price =>
  openFin.publishPrice(price)

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
          pricingService$
            .getSpotPriceStream({ symbol })
            .pipe(takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES))))
        )
      )
  )
}

export const pricingServiceEpic = (
  pricingService$: PricingService,
  openFin: OpenFin,
  referenceDataService: ReferenceDataService
) => {
  const addRatePrecisionToPrice = (
    currencyData: Map<string, CurrencyPair>
  ) => price => {
    return {
      ...price,
      ratePrecision: currencyData.get(price.symbol).ratePrecision
    }
  }

  const publishPriceToOpenFinEpic = action$ => {
    return priceForReferenceServiceSymbols$(action$, pricingService$).pipe(
      mergeMap(x =>
        referenceDataService
          .getCurrencyPairUpdates$()
          .pipe(
            map(currencyMap => addRatePrecisionToPrice(currencyMap)),
            filter(() => false),
            takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
          )
      )
    )
  }

  const updatePricesEpic = action$ => {
    return priceForReferenceServiceSymbols$(action$, pricingService$).pipe(
      scan(reducePrices, {}),
      map(createSpotPricesUpdateAction)
    )
  }

  return combineEpics(updatePricesEpic, publishPriceToOpenFinEpic)
}

// Reducer Logic
const stalePriceErrorMessage = 'Pricing is unavailable'

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
      const updatedPrices = keyBy(payload, 'symbol')
      const updatedPricesDataObj = {}

      _.forOwn(updatedPrices, (value, key) => {
        const newItem: SpotPriceTick = { ...value }
        if (newItem.priceStale && !newItem.notification) {
          newItem.notification = buildNotification(null, stalePriceErrorMessage)
        }
        updatedPricesDataObj[key] = newItem
      })

      return { ...state, ...updatedPricesDataObj }
    default:
      return state
  }
}
