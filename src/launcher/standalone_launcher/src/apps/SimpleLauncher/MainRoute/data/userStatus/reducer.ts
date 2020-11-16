import { USER_ACTION_TYPES, UserAction } from 'rt-actions'
import { User } from 'rt-types'

export interface UserState {
  selectingUser: boolean
  user?: User
}

const INITIAL_STATE: UserState = {
  selectingUser: false,
}

export const userStatus = (state: UserState = INITIAL_STATE, action: UserAction): UserState => {
  switch (action.type) {
    case USER_ACTION_TYPES.USER_SELECTED:
      return { selectingUser: false, user: action.payload }
    case USER_ACTION_TYPES.USER_SELECT:
      return { ...state, selectingUser: true }
    case USER_ACTION_TYPES.USER_NOT_SELECTED:
      return { ...state, selectingUser: false }
    case USER_ACTION_TYPES.USER_REMOVED:
      return INITIAL_STATE
    default:
      return state
  }
}
