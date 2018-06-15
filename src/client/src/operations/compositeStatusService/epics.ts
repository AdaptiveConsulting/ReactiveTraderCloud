import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES } from '../../connectionActions'
import { CompositeStatusServiceActions } from './actions'

export const compositeStatusServiceEpic: ApplicationEpic = (action$, store, { compositeStatusService }) =>
  action$.pipe(
    ofType(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      compositeStatusService.serviceStatusStream.pipe(
        map(CompositeStatusServiceActions.createCompositeStatusServiceAction),
        takeUntil(action$.pipe(ofType(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )
