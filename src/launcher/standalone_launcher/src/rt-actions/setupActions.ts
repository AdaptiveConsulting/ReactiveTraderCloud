import { action, ActionUnion } from 'rt-util'

export enum SETUP_ACTION_TYPES {
  SETUP = '@ReactiveTraderCloud/SETUP',
}

export const SetupActions = {
  setup: action<SETUP_ACTION_TYPES.SETUP>(SETUP_ACTION_TYPES.SETUP),
}

export type SetupAction = ActionUnion<typeof SetupActions>
