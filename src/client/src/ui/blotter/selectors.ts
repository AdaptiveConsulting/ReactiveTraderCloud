import { GlobalState } from 'combineReducers'
import { createSelector } from 'reselect'
import { selectServiceStatus } from 'ui/compositeStatus'

const getBlotterService = (state: GlobalState) => state.blotterService

export const selectBlotterService = createSelector([getBlotterService], blotterService => blotterService)

export const selectBlotterStatus = createSelector(
  [selectServiceStatus],
  serviceStatus => serviceStatus.blotter && serviceStatus.blotter.isConnected
)
