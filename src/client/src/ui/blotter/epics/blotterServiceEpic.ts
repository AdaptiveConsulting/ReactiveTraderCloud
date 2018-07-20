import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { interval } from 'rxjs'
import { filter, ignoreElements, map, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../../operations/connectionStatus'
import { TradeStatus } from '../../../types'
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
    map(action => action.payload.trades[0]),
    filter(trade => trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected),
    tap(trade => openFin.openTradeNotification(trade, state$.value.currencyPairs[trade.symbol])),
    ignoreElements()
  )

export const connectBlotterServiceToOpenFinEpic = combineEpics(connectBlotterToExcel, connectBlotterToNotifications)
