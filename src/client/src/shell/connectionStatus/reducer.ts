import { CONNECTION_ACTION_TYPES, ConnectionActions } from 'rt-actions'
import { ConnectionState, ConnectionStatus } from 'rt-system'
import { CONNECTION_STATUS_ACTION_TYPES, ConnectionStatusActions } from './connectionStatusActions'

const INITIAL_STATE: ConnectionState = {
  status: ConnectionStatus.disconnected,
  transportType: 'unknown',
  url: '',
}

export const connectionStatusReducer = (
  state: ConnectionState = INITIAL_STATE,
  action: ConnectionActions | ConnectionStatusActions,
): ConnectionState => {
  switch (action.type) {
    case CONNECTION_STATUS_ACTION_TYPES.CONNECTION_STATUS_UPDATE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {
        status: ConnectionStatus.sessionExpired,
        transportType: 'unknown',
        url: '',
      }
    default:
      return state
  }
}
