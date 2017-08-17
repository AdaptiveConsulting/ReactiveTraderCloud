import { createAction, handleActions } from 'redux-actions'

export enum ACTION_TYPES {
  TOGGLE_STATUS_SERVICES = '@ReactiveTraderCloud/TOGGLE_STATUS_SERVICES',
}

export const toggleStatusServices = createAction(ACTION_TYPES.TOGGLE_STATUS_SERVICES)

const INITIAL_STATE = false

export default handleActions({
  [ACTION_TYPES.TOGGLE_STATUS_SERVICES]: state => !state,
},                           INITIAL_STATE)
