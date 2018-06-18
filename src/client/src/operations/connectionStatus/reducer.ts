import { ConnectionStatus, ConnectionType } from '../../system'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, ConnectionActions } from './actions'

export interface ConnectionState {
  status: ConnectionStatus
  url: string
  transportType: ConnectionType
}

const INITIAL_STATE: ConnectionState = {
  status: ConnectionStatus.disconnected,
  transportType: ConnectionType.Unknown,
  url: ''
}

export const connectionStatusReducer = (
  state: ConnectionState = INITIAL_STATE,
  action: ConnectionActions
): ConnectionState => {
  switch (action.type) {
    case CONNECTION_ACTION_TYPES.CONNECTION_STATUS_UPDATE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {
        status: ConnectionStatus.sessionExpired,
        transportType: ConnectionType.Unknown,
        url: ''
      }
    default:
      return state
  }
}
