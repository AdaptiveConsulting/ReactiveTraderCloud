import { handleActions } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectionActions } from './connectionActions'
import { ConnectionInfo } from './services/connectionStatusService'
import { ConnectionStatus, ConnectionType } from './system'

export type ConnectionState = ConnectionInfo

const initialState: ConnectionState = {
  status: ConnectionStatus.disconnected,
  transportType: ConnectionType.Unknown,
  url: ''
}

export const connectionStatusEpicsCreator: ApplicationEpic = (action$, store, { connectionStatusService }) =>
  action$.pipe(
    ofType(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      connectionStatusService.connectionStatus$.pipe(
        map(ConnectionActions.createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(ofType(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
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
