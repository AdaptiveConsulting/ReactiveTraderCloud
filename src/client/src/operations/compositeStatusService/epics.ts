import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectAction, DisconnectAction } from '../../connectionActions'
import { CompositeStatusServiceActions } from './actions'

const { createCompositeStatusServiceAction } = CompositeStatusServiceActions
type CreateStatusServiceAction = ReturnType<typeof createCompositeStatusServiceAction>

export const compositeStatusServiceEpic: ApplicationEpic = (action$, state$, { compositeStatusService }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo<CreateStatusServiceAction>(
      compositeStatusService.serviceStatusStream.pipe(
        map(createCompositeStatusServiceAction),
        takeUntil(action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )
