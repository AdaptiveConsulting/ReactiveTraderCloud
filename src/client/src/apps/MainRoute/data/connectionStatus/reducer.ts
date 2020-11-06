import { CONNECTION_ACTION_TYPES, ConnectionAction } from 'rt-actions'
import { ConnectionStatus, ConnectionInfo } from 'rt-system'
import { CONNECTION_STATUS_ACTION_TYPES, ConnectionStatusAction } from './connectionStatusActions'

const INITIAL_STATE: ConnectionInfo = {
  status: ConnectionStatus.disconnected,
  url: '',
}

export const connectionStatusReducer = (
  state: ConnectionInfo = INITIAL_STATE,
  action: ConnectionAction | ConnectionStatusAction
): ConnectionInfo => {
  switch (action.type) {
    case CONNECTION_STATUS_ACTION_TYPES.CONNECTION_STATUS_UPDATE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {
        status: ConnectionStatus.sessionExpired,
        url: '',
      }
    default:
      return state
  }
}
