import { action, ActionUnion } from './ActionHelper'

export enum ACTION_TYPES {
  CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT',
  DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT'
}

export const ConnectionActions = {
  connect: action<typeof ACTION_TYPES.CONNECT_SERVICES>(ACTION_TYPES.CONNECT_SERVICES),
  disconnect: action<typeof ACTION_TYPES.DISCONNECT_SERVICES>(ACTION_TYPES.DISCONNECT_SERVICES)
}

export type ConnectionActions = ActionUnion<typeof ConnectionActions>
export type ConnectAction = ReturnType<typeof ConnectionActions.connect>
export type DisconnectAction = ReturnType<typeof ConnectionActions.disconnect>
