import { action, ActionUnion } from 'rt-util'
import { ConnectionInfo } from '../ui/connectionStatus/connectionStatusService'

export enum CONNECTION_ACTION_TYPES {
  CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT',
  DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT',
  CONNECTION_STATUS_UPDATE = '@ReactiveTraderCloud/CONNECTION_STATUS_UPDATE'
}

export const ConnectionActions = {
  connect: action<CONNECTION_ACTION_TYPES.CONNECT_SERVICES>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
  disconnect: action<CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES),
  createConnectionStatusUpdateAction: action<CONNECTION_ACTION_TYPES.CONNECTION_STATUS_UPDATE, ConnectionInfo>(
    CONNECTION_ACTION_TYPES.CONNECTION_STATUS_UPDATE
  )
}

export type ConnectionActions = ActionUnion<typeof ConnectionActions>
export type ConnectAction = ReturnType<typeof ConnectionActions.connect>
export type DisconnectAction = ReturnType<typeof ConnectionActions.disconnect>
