import {
  ConnectionActions,
  CONNECTION_ACTION_TYPES,
  ConnectAction as ConnectActionType,
  DisconnectAction as DisconnectActionType,
} from './connectionActions'
import { SetupAction as SetupActionType } from './setupActions'
import { LayoutAction as LayoutActionType, LayoutActions } from './layoutActions'
import { WorkspaceAction as WorkspaceActionType } from './workspaceActions'

export { REF_ACTION_TYPES, ReferenceActions } from './refDataActions'
export { SetupActions, SETUP_ACTION_TYPES } from './setupActions'
export { WorkspaceActions, WORKSPACE_ACTION_TYPES } from './workspaceActions'
export { LAYOUT_ACTION_TYPES } from './layoutActions'
export { LayoutActions }
export { ConnectionActions, CONNECTION_ACTION_TYPES }
export { applicationConnected, applicationDisconnected } from './operators'

export type ConnectAction = ConnectActionType
export type DisconnectAction = DisconnectActionType
export type LayoutAction = LayoutActionType
export type SetupAction = SetupActionType
export type WorkspaceAction = WorkspaceActionType
