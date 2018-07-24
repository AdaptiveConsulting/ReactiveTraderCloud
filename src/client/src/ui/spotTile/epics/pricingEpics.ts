import { Observable } from 'rxjs'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { SpotPriceTick } from '../../../types'
import { applicationConnected, applicationDisconnected } from '../../../ui/connectionStatus'
import { SpotTileActions } from '../actions'

const { priceUpdateAction } = SpotTileActions
type PriceUpdateAction = ReturnType<typeof priceUpdateAction>

export const pricingServiceEpic = (pricesForCurrenciesInRefData: Observable<SpotPriceTick>) => action$ => {
  return action$.pipe(
    applicationConnected,
    switchMapTo<PriceUpdateAction>(
      pricesForCurrenciesInRefData.pipe(
        map(priceUpdateAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
}
