import { GlobalState } from 'StoreTypes'
import { createSelector } from 'reselect'

export const selectState = (state: GlobalState) => state.layout

export const blotterSelector = createSelector(
  [selectState],
  state => state.blotter,
)

export const analyticsSelector = createSelector(
  [selectState],
  state => state.analytics,
)
