import { action, ActionUnion } from 'rt-util'

export enum CONNECTION_ACTION_TYPES {
  CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT',
  DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT'
}

export const ConnectionActions = {
  connect: action<CONNECTION_ACTION_TYPES.CONNECT_SERVICES>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES),
  disconnect: action<CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)
}

export type ConnectionActions = ActionUnion<typeof ConnectionActions>
export type ConnectAction = ReturnType<typeof ConnectionActions.connect>
export type DisconnectAction = ReturnType<typeof ConnectionActions.disconnect>
