import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { CurrencyPairMap } from 'rt-types'
import { Observable } from 'rxjs'
import { ignoreElements, map, mergeMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotPriceTick } from '../model/spotPriceTick'

const addRatePrecisionToPrice = (currencyData: CurrencyPairMap, price: SpotPriceTick) => ({
  ...price,
  ratePrecision: currencyData[price.symbol].ratePrecision
})

export const publishPriceToOpenFinEpic = (pricesForCurrenciesInRefData: Observable<SpotPriceTick>): ApplicationEpic => (
  action$,
  state$,
  { referenceDataService, openFin }
) =>
  action$.pipe(
    applicationConnected,
    switchMapTo(
      pricesForCurrenciesInRefData.pipe(
        mergeMap((price: SpotPriceTick) =>
          referenceDataService.getCurrencyPairUpdates$().pipe(
            map(currencyMap => addRatePrecisionToPrice(currencyMap, price)),
            tap(enhancedPrice => openFin.publishPrice(enhancedPrice)),
            ignoreElements(),
            takeUntil(action$.pipe(applicationDisconnected))
          )
        )
      )
    )
  )
