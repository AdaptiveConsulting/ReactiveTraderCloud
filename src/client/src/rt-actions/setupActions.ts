import { action, ActionUnion } from 'rt-util'

export enum CONNECTION_ACTION_TYPES {
  SETUP = '@ReactiveTraderCloud/SETUP',
}

export const SetupActions = {
  setup: action<CONNECTION_ACTION_TYPES.SETUP>(CONNECTION_ACTION_TYPES.SETUP),
}

export type SetupAction = ActionUnion<typeof SetupActions>
