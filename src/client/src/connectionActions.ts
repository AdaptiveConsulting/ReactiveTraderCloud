import { action } from './ActionHelper'

export const CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT'
export const DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT'

export const connect = action(CONNECT_SERVICES)
export const disconnect = action(DISCONNECT_SERVICES)

export type ConnectAction = ReturnType<typeof connect>
export type DisconnectAction = ReturnType<typeof disconnect>
