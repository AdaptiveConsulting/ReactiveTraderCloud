import { ofType } from 'redux-observable'
import { filter, map, mergeMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES } from '../../../operations/connectionStatus'
import { CurrencyPair, SpotPriceTick } from '../../../types'

export const addRatePrecisionToPrice = (currencyData: Map<string, CurrencyPair>, price: SpotPriceTick) => {
  return {
    ...price,
    ratePrecision: currencyData.get(price.symbol).ratePrecision
  }
}

export const publishPriceToOpenFinEpic: ApplicationEpic = (
  action$,
  store,
  { pricesForCurrenciesInRefData, referenceDataService, openFin }
) =>
  action$.pipe(
    ofType(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      pricesForCurrenciesInRefData.pipe(
        mergeMap(price =>
          referenceDataService.getCurrencyPairUpdates$().pipe(
            map(currencyMap => addRatePrecisionToPrice(currencyMap, price)),
            tap<any>(enhancedPrice => openFin.publishPrice(enhancedPrice)),
            filter(() => false),
            takeUntil(action$.pipe(ofType(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
          )
        )
      )
    )
  )
