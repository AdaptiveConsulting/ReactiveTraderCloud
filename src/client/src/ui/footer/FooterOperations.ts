import { createAction, handleActions } from 'redux-actions'

export enum ACTION_TYPES {
  TOGGLE_STATUS_SERVICES = '@ReactiveTraderCloud/TOGGLE_STATUS_SERVICES',
  OPEN_LINK = '@ReactiveTraderCloud/FOOTER_OPEN_LINK',
}

export const toggleStatusServices = createAction(ACTION_TYPES.TOGGLE_STATUS_SERVICES)
export const openLinks = createAction(ACTION_TYPES.OPEN_LINK, payload => payload)

const INITIAL_STATE = false


export const footerEpic = openFin => (action$) => {
  return action$.ofType(ACTION_TYPES.OPEN_LINK)
    .map(action => openLinks(openFin))
}

export default handleActions({
  [ACTION_TYPES.TOGGLE_STATUS_SERVICES]: state => !state,
}, INITIAL_STATE)
