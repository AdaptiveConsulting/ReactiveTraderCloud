import { Action } from 'redux'
import { handleActions } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import {
  ACTION_TYPES as CONNECTION_ACTION_TYPES,
  ConnectAction,
  ConnectionActions,
  DisconnectAction
} from './connectionActions'
import { ConnectionInfo } from './services/connectionStatusService'
import { ConnectionStatus, ConnectionType } from './system'

export interface ConnectionState {
  status: ConnectionStatus
  url: string
  transportType: ConnectionType
}

const initialState: ConnectionState = {
  status: ConnectionStatus.disconnected,
  transportType: ConnectionType.Unknown,
  url: ''
}

type CreateConnectionAction = ReturnType<typeof ConnectionActions.createConnectionStatusUpdateAction>

export const connectionStatusEpicsCreator: ApplicationEpic = (action$, state$, { connectionStatusService }) =>
  action$.pipe(
    ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo<CreateConnectionAction>(
      connectionStatusService.connectionStatus$.pipe(
        map<ConnectionInfo, CreateConnectionAction>(ConnectionActions.createConnectionStatusUpdateAction),
        takeUntil<CreateConnectionAction>(
          action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))
        )
      )
    )
  )

export default handleActions(
  {
    [CONNECTION_ACTION_TYPES.CONNECTION_STATUS_UPDATE]: (state: ConnectionState, action): ConnectionState =>
      action.payload,
    [CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES]: (): ConnectionState => ({
      status: ConnectionStatus.sessionExpired,
      transportType: ConnectionType.Unknown,
      url: ''
    })
  },
  initialState
)
