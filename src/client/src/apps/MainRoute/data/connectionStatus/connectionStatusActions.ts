import { action, ActionUnion } from 'rt-util'
import { ConnectionInfo } from './connectionStatusService'

export enum CONNECTION_STATUS_ACTION_TYPES {
  CONNECTION_STATUS_UPDATE = '@ReactiveTraderCloud/CONNECTION_STATUS_UPDATE'
}

export const ConnectionStatusActions = {
  createConnectionStatusUpdateAction: action<CONNECTION_STATUS_ACTION_TYPES.CONNECTION_STATUS_UPDATE, ConnectionInfo>(
    CONNECTION_STATUS_ACTION_TYPES.CONNECTION_STATUS_UPDATE
  )
}

export type ConnectionStatusActions = ActionUnion<typeof ConnectionStatusActions>
