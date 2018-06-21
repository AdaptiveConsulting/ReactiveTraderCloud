import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ACTION_TYPES, ConnectAction, DisconnectAction } from '.'

export const applicationConnected = ofType<Action, ConnectAction>(ACTION_TYPES.CONNECT_SERVICES)
export const applicationDisconnected = ofType<Action, DisconnectAction>(ACTION_TYPES.DISCONNECT_SERVICES)
