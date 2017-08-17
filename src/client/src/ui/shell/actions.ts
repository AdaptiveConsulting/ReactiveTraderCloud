import { ACTION_TYPES } from '../../redux/connectionStatus/connectionStatusOperations'

export function reconnect() {
  return { type: ACTION_TYPES.RECONNECT }
}
