import { action, ActionUnion } from 'rt-util'

export enum WORKSPACE_ACTION_TYPES {
  WORKSPACE_RESTORED = '@ReactiveTraderCloud/WORKSPACE_RESTORED',
  WORKSPACE_SAVE = '@ReactiveTraderCloud/WORKSPACE_SAVE',
  WORKSPACE_SAVED = '@ReactiveTraderCloud/WORKSPACE_SAVED',
}

export const WorkspaceActions = {
  restored: action<WORKSPACE_ACTION_TYPES.WORKSPACE_RESTORED>(
    WORKSPACE_ACTION_TYPES.WORKSPACE_RESTORED,
  ),
  save: action<WORKSPACE_ACTION_TYPES.WORKSPACE_SAVE>(WORKSPACE_ACTION_TYPES.WORKSPACE_SAVE),
  saved: action<WORKSPACE_ACTION_TYPES.WORKSPACE_SAVED>(WORKSPACE_ACTION_TYPES.WORKSPACE_SAVED),
}

export type WorkspaceAction = ActionUnion<typeof WorkspaceActions>
