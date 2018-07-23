import { ignoreElements, map, mergeMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../../operations/connectionStatus'
import { SpotPriceTick } from '../../../types'
import { CurrencyPairMap } from '../../../types/currencyPair'

export const addRatePrecisionToPrice = (currencyData: CurrencyPairMap, price: SpotPriceTick) => ({
  ...price,
  ratePrecision: currencyData[price.symbol].ratePrecision
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
