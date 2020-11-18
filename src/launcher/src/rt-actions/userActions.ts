import { action, ActionUnion } from 'rt-util'
import { User } from 'rt-types'

export enum USER_ACTION_TYPES {
  USER_SELECTED = '@ReactiveTraderCloud/USER_SELECTED',
  USER_NOT_SELECTED = '@ReactiveTraderCloud/USER_NOT_SELECTED',
  USER_SELECT = '@ReactiveTraderCloud/USER_SELECT',
  USER_REMOVED = '@ReactiveTraderCloud/REMOVED',
}

export const UserActions = {
  selected: action<USER_ACTION_TYPES.USER_SELECTED, User>(USER_ACTION_TYPES.USER_SELECTED),
  notSelected: action<USER_ACTION_TYPES.USER_NOT_SELECTED>(USER_ACTION_TYPES.USER_NOT_SELECTED),
  select: action<USER_ACTION_TYPES.USER_SELECT>(USER_ACTION_TYPES.USER_SELECT),
  remove: action<USER_ACTION_TYPES.USER_REMOVED>(USER_ACTION_TYPES.USER_REMOVED),
}

export type UserAction = ActionUnion<typeof UserActions>
