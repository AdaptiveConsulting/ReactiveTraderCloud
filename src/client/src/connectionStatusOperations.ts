import { createAction, handleActions } from 'redux-actions'
import { ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
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
    ofType(CONNECT_SERVICES),
    switchMapTo(
      connectionStatusService.connectionStatus$.pipe(
        map(createConnectionStatusUpdateAction),
        takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
      )
    )
  )

export default handleActions(
  {
    [ACTION_TYPES.CONNECTION_STATUS_UPDATE]: (state: State, action): State => action.payload,
    [DISCONNECT_SERVICES]: (): State => ({
      status: ConnectionStatus.sessionExpired,
      transportType: ConnectionType.Unknown,
      url: ''
    })
  },
  initialState
)
