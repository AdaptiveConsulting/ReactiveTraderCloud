import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, map, mergeMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import {
  ACTION_TYPES as CONNECTION_ACTION_TYPES,
  ConnectAction,
  DisconnectAction
} from '../../../operations/connectionStatus'
import { CurrencyPair, SpotPriceTick } from '../../../types'

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
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      pricesForCurrenciesInRefData.pipe(
        mergeMap((price: SpotPriceTick) =>
          referenceDataService.getCurrencyPairUpdates$().pipe(
            map(currencyMap => addRatePrecisionToPrice(currencyMap, price)),
            tap(enhancedPrice => openFin.publishPrice(enhancedPrice)),
            ignoreElements(),
            takeUntil(action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
          )
        )
      )
    )
  )
