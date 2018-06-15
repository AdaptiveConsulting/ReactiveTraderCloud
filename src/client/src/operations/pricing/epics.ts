import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import {
  ACTION_TYPES as CONNECTION_ACTION_TYPES,
  ConnectAction,
  DisconnectAction
} from '../../operations/connectionStatus'
import { PricingActions } from './actions'

const { priceUpdateAction } = PricingActions
type PriceUpdateAction = ReturnType<typeof priceUpdateAction>

export const pricingServiceEpic: ApplicationEpic = (action$, state$, { pricesForCurrenciesInRefData }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      pricesForCurrenciesInRefData.pipe(
        map(priceUpdateAction),
        takeUntil<PriceUpdateAction>(
          action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))
        )
      )
    )
  )
