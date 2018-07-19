import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { interval } from 'rxjs'
import { ignoreElements, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import {
  ACTION_TYPES as CONNECTION_ACTION_TYPES,
  ConnectAction,
  DisconnectAction
} from '../../../operations/connectionStatus'

export const connectBlotterServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      interval(7500).pipe(
        takeUntil(action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))),
        tap(() => openFin.sendAllBlotterData(state$.value.blotterService.trades, state$.value.currencyPairs)),
        ignoreElements()
      )
    )
  )
