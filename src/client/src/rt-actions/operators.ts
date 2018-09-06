import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ConnectAction, CONNECTION_ACTION_TYPES, DisconnectAction } from './'

export const applicationConnected = ofType<Action, ConnectAction>(CONNECTION_ACTION_TYPES.CONNECT_SERVICES)
export const applicationDisconnected = ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)
