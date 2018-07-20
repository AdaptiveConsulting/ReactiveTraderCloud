import { ignoreElements, map, mergeMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { CurrencyPair, SpotPriceTick } from '../../../types'
import { applicationConnected, applicationDisconnected } from '../../../ui/connectionStatus'

export const addRatePrecisionToPrice = (currencyData: Map<string, CurrencyPair>, price: SpotPriceTick) => ({
  ...price,
  ratePrecision: currencyData.get(price.symbol).ratePrecision
})

export const publishPriceToOpenFinEpic: ApplicationEpic = (
  action$,
  state$,
  { pricesForCurrenciesInRefData, referenceDataService, openFin }
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
