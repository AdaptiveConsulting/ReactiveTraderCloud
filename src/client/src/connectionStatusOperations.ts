import { createAction, handleActions } from 'redux-actions'
import { combineEpics, ofType } from 'redux-observable'
import { map, switchMapTo, takeUntil } from 'rxjs/operators'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
import { ConnectionStatusService } from './services'
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

export const createConnectionStatusUpdateAction = createAction(
  ACTION_TYPES.CONNECTION_STATUS_UPDATE
)

export function connectionStatusEpicsCreator(
  connectionStatusService: ConnectionStatusService
) {
  const updateConnectionStateEpic = action$ =>
    action$.pipe(
      ofType(CONNECT_SERVICES),
      switchMapTo(
        connectionStatusService.connectionStatus$.pipe(
          map(createConnectionStatusUpdateAction),
          takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
        )
      )
    )

  return combineEpics(updateConnectionStateEpic)
}

export default handleActions(
  {
    [ACTION_TYPES.CONNECTION_STATUS_UPDATE]: (state: State, action): State =>
      action.payload,
    [DISCONNECT_SERVICES]: (): State => ({
      status: ConnectionStatus.sessionExpired,
      transportType: ConnectionType.Unknown,
      url: ''
    })
  },
  initialState
)
