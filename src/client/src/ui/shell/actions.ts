import { ACTION_TYPES } from '../../connectionStatusOperations'

export function reconnect() {
  return { type: ACTION_TYPES.RECONNECT }
}
