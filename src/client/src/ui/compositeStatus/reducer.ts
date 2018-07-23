import { ServiceStatus } from 'common/types'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../connectionStatus'
import { ACTION_TYPES, CompositeStatusServiceActions } from './actions'

interface CompositeStatusServiceState {
  [key: string]: ServiceStatus
}

export const INITIAL_STATE: CompositeStatusServiceState = {}

export function compositeStatusServiceReducer(
  state: CompositeStatusServiceState = INITIAL_STATE,
  action: CompositeStatusServiceActions | DisconnectAction
): CompositeStatusServiceState {
  switch (action.type) {
    case ACTION_TYPES.COMPOSITE_STATUS_SERVICE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}
