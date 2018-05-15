import { createAction } from 'redux-actions'

export const CONNECT_SERVICES = '@ReactiveTraderCloud/CONNECT'
export const DISCONNECT_SERVICES = '@ReactiveTraderCloud/DISCONNECT'

export const connect = createAction(CONNECT_SERVICES)
export const disconnect = createAction(DISCONNECT_SERVICES)
