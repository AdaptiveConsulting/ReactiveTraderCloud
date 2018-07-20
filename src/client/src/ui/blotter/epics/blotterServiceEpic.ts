import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { interval } from 'rxjs'
import { ignoreElements, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../../operations/connectionStatus'
import { ACTION_TYPES, BlotterActions } from '../actions'

type NewTradesAction = ReturnType<typeof BlotterActions.createNewTradesAction>

const connectBlotterToExcel: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo(
      interval(7500).pipe(
        takeUntil(action$.pipe(applicationDisconnected)),
        tap(() => openFin.sendAllBlotterData(state$.value.blotterService.trades, state$.value.currencyPairs)),
        ignoreElements()
      )
    )
  )

const connectBlotterToNotifications: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, NewTradesAction>(ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    ignoreElements()
  )

export const connectBlotterServiceToOpenFinEpic = combineEpics(connectBlotterToExcel, connectBlotterToNotifications)
