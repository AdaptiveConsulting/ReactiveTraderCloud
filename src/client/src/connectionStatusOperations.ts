import { createAction, handleActions } from 'redux-actions'
import { combineEpics } from 'redux-observable'
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

export function connectionStatusEpicsCreator(compositeStatusService$) {
  const connectToServices = () => compositeStatusService$.connection.connect()

  const updateConnectionStateEpic = () => {
    return compositeStatusService$.connectionStatusStream
      .map(connectionStatusToState(compositeStatusService$))
      .map(createConnectionStatusUpdateAction)
  }

  const reconnectEpic = action$ => {
    return (
      action$
        .ofType(ACTION_TYPES.RECONNECT)
        .do(connectToServices)
        // Hack to never emit any actions, because we don't need any action.
        .takeLast()
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
