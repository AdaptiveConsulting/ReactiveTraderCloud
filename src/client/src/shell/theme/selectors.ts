import { createSelector } from 'reselect'

import { GlobalState } from 'combineReducers'

export const selectState = (state: GlobalState) => state.theme

export const selectType = createSelector([selectState], state => state.type)
