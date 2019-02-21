import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

const getServices = ({ compositeStatusService }: GlobalState) => compositeStatusService
export const selectServices = createSelector(
  [getServices],
  compositeStatusService => Object.values(compositeStatusService),
)
