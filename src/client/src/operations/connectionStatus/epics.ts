import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectAction, ConnectionActions, DisconnectAction } from './actions'

type CreateConnectionAction = ReturnType<typeof ConnectionActions.createConnectionStatusUpdateAction>

export const connectionStatusEpic: ApplicationEpic = (action$, state$, { connectionStatusService }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      connectionStatusService.connectionStatus$.pipe(
        map(ConnectionActions.createConnectionStatusUpdateAction),
        takeUntil<CreateConnectionAction>(
          action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))
        )
      )
    )
  )
