import { createAction, handleActions } from 'redux-actions'

export enum ACTION_TYPES {
  TOGGLE_ANALYTICS = '@ReactiveTraderCloud/TOGGLE_ANALYTICS'
}

export const toggleAnalytics = createAction(ACTION_TYPES.TOGGLE_ANALYTICS)

const initialState = true

export default handleActions({
  [ACTION_TYPES.TOGGLE_ANALYTICS]: state => !state
}, initialState)
