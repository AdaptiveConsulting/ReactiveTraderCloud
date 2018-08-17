import { Observable } from 'rxjs'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../../ui/connectionStatus'
import { SpotTileActions } from '../actions'
import { SpotPriceTick } from '../model/spotPriceTick'

const { priceUpdateAction } = SpotTileActions
type PriceUpdateAction = ReturnType<typeof priceUpdateAction>

export const pricingServiceEpic = (
  pricesForCurrenciesInRefData: Observable<SpotPriceTick>
): ApplicationEpic => action$ => {
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
