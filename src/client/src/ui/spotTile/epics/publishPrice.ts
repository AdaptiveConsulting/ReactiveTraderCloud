import { CurrencyPairMap } from 'rt-types'
import { Observable } from 'rxjs'
import { ignoreElements, map, mergeMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationDependencies } from '../../../applicationServices'
import { applicationConnected, applicationDisconnected } from '../../../ui/connectionStatus'
import { SpotPriceTick } from '../model/spotPriceTick'

const addRatePrecisionToPrice = (currencyData: CurrencyPairMap, price: SpotPriceTick) => ({
  ...price,
  ratePrecision: currencyData[price.symbol].ratePrecision
})

export const publishPriceToOpenFinEpic = (pricesForCurrenciesInRefData: Observable<SpotPriceTick>) => (
  action$,
  state$,
  { referenceDataService, openFin }: ApplicationDependencies
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
