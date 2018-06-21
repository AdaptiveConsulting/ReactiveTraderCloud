import { action, ActionUnion } from '../../ActionHelper'
import { ConnectionInfo } from '../../services/connectionStatusService'

export enum ACTION_TYPES {
  CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT',
  DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT',
  CONNECTION_STATUS_UPDATE = '@ReactiveTraderCloud/CONNECTION_STATUS_UPDATE'
}

export const ConnectionActions = {
  connect: action<typeof ACTION_TYPES.CONNECT_SERVICES>(ACTION_TYPES.CONNECT_SERVICES),
  disconnect: action<typeof ACTION_TYPES.DISCONNECT_SERVICES>(ACTION_TYPES.DISCONNECT_SERVICES),
  createConnectionStatusUpdateAction: action<typeof ACTION_TYPES.CONNECTION_STATUS_UPDATE, ConnectionInfo>(
    ACTION_TYPES.CONNECTION_STATUS_UPDATE
  )
}

export type ConnectionActions = ActionUnion<typeof ConnectionActions>
export type ConnectAction = ReturnType<typeof ConnectionActions.connect>
export type DisconnectAction = ReturnType<typeof ConnectionActions.disconnect>
