import { interval } from 'rxjs'
import { ignoreElements, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../connectionStatus'

export const connectBlotterServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
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
