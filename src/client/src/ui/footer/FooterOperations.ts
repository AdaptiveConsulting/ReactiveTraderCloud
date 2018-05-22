import { Action } from 'redux'
import { action as creatAction } from '../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_STATUS_SERVICES = '@ReactiveTraderCloud/TOGGLE_STATUS_SERVICES'
}

export const toggleStatusServices = creatAction(ACTION_TYPES.TOGGLE_STATUS_SERVICES)

const INITIAL_STATE: boolean = false

export default function(state: typeof INITIAL_STATE = INITIAL_STATE, actions: Action) {
  const action = actions as ReturnType<typeof toggleStatusServices>
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_STATUS_SERVICES:
      return !state
    default:
      return state
  }
}
