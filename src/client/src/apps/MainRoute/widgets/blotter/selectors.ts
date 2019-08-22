import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

const getBlotterTrades = (state: GlobalState) => state.blotterService && state.blotterService.trades
const getBlotterStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.blotter && compositeStatusService.blotter.connectionStatus

export const selectBlotterRows = createSelector(getBlotterTrades, trades => Object.values(trades).reverse())

export const selectBlotterStatus = createSelector(getBlotterStatus, status => status)
