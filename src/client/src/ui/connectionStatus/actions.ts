import { action, ActionUnion } from 'rt-util'
import { ConnectionInfo } from './connectionStatusService'

export enum ACTION_TYPES {
  CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT',
  DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT',
  CONNECTION_STATUS_UPDATE = '@ReactiveTraderCloud/CONNECTION_STATUS_UPDATE'
}

export const ConnectionActions = {
  connect: action<ACTION_TYPES.CONNECT_SERVICES>(ACTION_TYPES.CONNECT_SERVICES),
  disconnect: action<ACTION_TYPES.DISCONNECT_SERVICES>(ACTION_TYPES.DISCONNECT_SERVICES),
  createConnectionStatusUpdateAction: action<ACTION_TYPES.CONNECTION_STATUS_UPDATE, ConnectionInfo>(
    ACTION_TYPES.CONNECTION_STATUS_UPDATE
  )
}

export type ConnectionActions = ActionUnion<typeof ConnectionActions>
export type ConnectAction = ReturnType<typeof ConnectionActions.connect>
export type DisconnectAction = ReturnType<typeof ConnectionActions.disconnect>
