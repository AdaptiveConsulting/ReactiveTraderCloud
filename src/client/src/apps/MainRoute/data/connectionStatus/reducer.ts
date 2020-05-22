import { CONNECTION_ACTION_TYPES, ConnectionActions } from 'rt-actions'
import { ConnectionStatus, ConnectionInfo } from 'rt-system'
import { CONNECTION_STATUS_ACTION_TYPES, ConnectionStatusActions } from './connectionStatusActions'

const INITIAL_STATE: ConnectionInfo = {
  status: ConnectionStatus.disconnected,
  url: ''
}

export const connectionStatusReducer = (
  state: ConnectionInfo = INITIAL_STATE,
  action: ConnectionActions | ConnectionStatusActions
): ConnectionInfo => {
  switch (action.type) {
    case CONNECTION_STATUS_ACTION_TYPES.CONNECTION_STATUS_UPDATE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {
        status: ConnectionStatus.sessionExpired,
        url: ''
      }
    default:
      return state
  }
}
