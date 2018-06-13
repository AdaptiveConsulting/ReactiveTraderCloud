import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectAction, DisconnectAction } from '../../connectionActions'
import { SpotPriceTick } from '../../types'
import { PricingActions } from './actions'

type PriceUpdateAction = ReturnType<typeof PricingActions.priceUpdateAction>

export const pricingServiceEpic: ApplicationEpic = (action$, state$, { pricesForCurrenciesInRefData }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo<PriceUpdateAction>(
      pricesForCurrenciesInRefData.pipe(
        map<SpotPriceTick, PriceUpdateAction>(PricingActions.priceUpdateAction),
        takeUntil<PriceUpdateAction>(
          action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))
        )
      )
    )
  )
