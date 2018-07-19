import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { applicationConnected, applicationDisconnected } from '../../../operations/connectionStatus'
import { BlotterActions } from '../actions'

const { createNewTradesAction } = BlotterActions

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { blotterService }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo(
      blotterService.getTradesStream().pipe(
        map(createNewTradesAction),
        takeUntil(action$.pipe(applicationDisconnected))
      )
    )
  )
