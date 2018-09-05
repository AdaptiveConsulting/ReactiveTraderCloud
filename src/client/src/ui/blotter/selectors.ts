import { createSelector } from 'reselect'
import { ServiceConnectionStatus } from 'rt-types'
import { GlobalState } from 'StoreTypes'

const getBlotterService = (state: GlobalState) => state.blotterService
const getServiceStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.blotter &&
  compositeStatusService.blotter.connectionStatus === ServiceConnectionStatus.CONNECTED

export const selectBlotterService = createSelector(getBlotterService, blotterService => blotterService)

export const selectBlotterStatus = createSelector(getServiceStatus, status => status)
