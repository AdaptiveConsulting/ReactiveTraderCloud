import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../operations/connectionStatus'
import { PricingActions } from './actions'

const { priceUpdateAction } = PricingActions
type PriceUpdateAction = ReturnType<typeof priceUpdateAction>

export const pricingServiceEpic: ApplicationEpic = (action$, state$, { pricesForCurrenciesInRefData }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo<PriceUpdateAction>(
      pricesForCurrenciesInRefData.pipe(
        map(priceUpdateAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
