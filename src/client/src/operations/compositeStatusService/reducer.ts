import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../operations/connectionStatus'
import { ServiceStatus } from '../../types'
import { ACTION_TYPES, CompositeStatusServiceActions } from './actions'

interface CompositeStatusServiceState {
  [key: string]: ServiceStatus
}

export const initialState: CompositeStatusServiceState = {}

export function compositeStatusServiceReducer(
  state: CompositeStatusServiceState = initialState,
  action: CompositeStatusServiceActions | DisconnectAction
): CompositeStatusServiceState {
  switch (action.type) {
    case ACTION_TYPES.COMPOSITE_STATUS_SERVICE:
      return action.payload
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return initialState
    default:
      return state
  }
}
