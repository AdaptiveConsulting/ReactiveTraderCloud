import { ACTION_TYPES, FooterActions } from './actions'

export type FooterState = boolean

const INITIAL_STATE: FooterState = false

export function footerReducer(state: FooterState = INITIAL_STATE, action: FooterActions): FooterState {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_STATUS_SERVICES:
      return !state
    default:
      return state
  }
}
