import { createAction, handleActions } from 'redux-actions'
import { combineEpics, ofType } from 'redux-observable'
import { map, takeLast } from 'rxjs/operators'
import { CompositeStatusService } from './services'
import { ConnectionStatus } from './types/'

export enum ACTION_TYPES {
  CONNECTION_STATUS_UPDATE = '@ReactiveTraderCloud/CONNECTION_STATUS_UPDATE',
  RECONNECT = '@ReactiveTraderCloud/RECONNECT'
}

interface State {
  connection: ConnectionStatus
  connectionType: string
  url: string
}

export type Connections = State

const initialState: State = {
  connection: ConnectionStatus.disconnected,
  connectionType: '',
  url: ''
}

export const createConnectionStatusUpdateAction = createAction(
  ACTION_TYPES.CONNECTION_STATUS_UPDATE
)

const connectionStatusToState = compositeStatusService$ => (
  connectionStatus: ConnectionStatus
): State => {
  return {
    connection: connectionStatus || ConnectionStatus.init,
    connectionType: compositeStatusService$.connectionType || '',
    url: compositeStatusService$.connectionUrl || ''
  }
}

export function connectionStatusEpicsCreator(
  compositeStatusService$: CompositeStatusService
) {
  const updateConnectionStateEpic = () => {
    return compositeStatusService$.connectionStatusStream.pipe(
      map(connectionStatusToState(compositeStatusService$)),
      map(createConnectionStatusUpdateAction)
    )
  }

  const reconnectEpic = action$ => {
    return action$.pipe(
      ofType(ACTION_TYPES.RECONNECT),
      // Hack to never emit any actions, because we don't need any action.
      takeLast(1)
    )
  }

  return combineEpics(updateConnectionStateEpic, reconnectEpic)
}

export default handleActions(
  {
    [ACTION_TYPES.CONNECTION_STATUS_UPDATE]: (state: State, action): State =>
      action.payload
  },
  initialState
)
