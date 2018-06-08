import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from '../../connectionActions'
import { BlotterActions } from './actions'

export const blotterServiceEpic: ApplicationEpic = (action$, state$, { blotterService, openFin }) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      blotterService.getTradesStream().pipe(
        map(BlotterActions.createNewTradesAction),
        takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
      )
    )
  )

export default blotterServiceEpic
