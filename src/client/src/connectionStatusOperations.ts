import { createAction, handleActions } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES } from './connectionActions'
import { ConnectionInfo } from './services/connectionStatusService'
import { ConnectionStatus, ConnectionType } from './system'

export enum ACTION_TYPES {
  CONNECTION_STATUS_UPDATE = '@ReactiveTraderCloud/CONNECTION_STATUS_UPDATE'
}

export type State = ConnectionInfo

const initialState: State = {
  status: ConnectionStatus.disconnected,
  transportType: ConnectionType.Unknown,
  url: ''
}

export const createConnectionStatusUpdateAction = createAction(ACTION_TYPES.CONNECTION_STATUS_UPDATE)

export const connectionStatusEpicsCreator: ApplicationEpic = (action$, store, { connectionStatusService }) =>
  action$.pipe(
    ofType(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
    switchMapTo(
      connectionStatusService.connectionStatus$.pipe(
        map(createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(ofType(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )

export default handleActions(
  {
    [ACTION_TYPES.CONNECTION_STATUS_UPDATE]: (state: State, action): State => action.payload,
    [CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES]: (): State => ({
      status: ConnectionStatus.sessionExpired,
      transportType: ConnectionType.Unknown,
      url: ''
    })
  },
  initialState
)
