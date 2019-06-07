import { GlobalState } from '../../StoreTypes'
import { createSelector } from 'reselect'

export const selectState = (state: GlobalState) => state.layout

export const displayBlotterSelector = createSelector(
  [selectState],
  state => state.displayBlotter,
)

export const displayAnalyticsSelector = createSelector(
  [selectState],
  state => state.displayAnalytics,
)
