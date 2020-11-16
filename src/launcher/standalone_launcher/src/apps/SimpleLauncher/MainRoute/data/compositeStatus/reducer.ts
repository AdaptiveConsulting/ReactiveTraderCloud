import { CONNECTION_ACTION_TYPES, DisconnectAction } from 'rt-actions'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { COMPOSITE_ACTION_TYPES, CompositeStatusServiceAction } from './actions'

export interface CompositeStatusServiceState {
  [key: string]: ServiceStatus
}

export const INITIAL_STATE: CompositeStatusServiceState = [
  'blotter',
  'reference',
  'execution',
  'pricing',
  'analytics',
].reduce((acc, serviceType) => {
  acc[serviceType] = {
    serviceType,
    connectionStatus: ServiceConnectionStatus.CONNECTING,
    connectedInstanceCount: 0,
  }
  return acc
}, {})

export function compositeStatusServiceReducer(
  state: CompositeStatusServiceState = INITIAL_STATE,
  action: CompositeStatusServiceAction | DisconnectAction
): CompositeStatusServiceState {
  switch (action.type) {
    case COMPOSITE_ACTION_TYPES.COMPOSITE_STATUS_SERVICE:
      return { ...state, ...action.payload }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}
