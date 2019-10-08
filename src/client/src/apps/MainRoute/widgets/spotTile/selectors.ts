import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { SpotTileContainerOwnProps } from './SpotTileContainer'

const selectNotional = (state: GlobalState, props: SpotTileContainerOwnProps) =>
  state.spotTilesData[props.id] && state.spotTilesData[props.id].notional

const getCurrencyPair = (state: GlobalState, props: SpotTileContainerOwnProps) =>
  state.currencyPairs[props.id]
const selectCurrencyPair = createSelector(
  [getCurrencyPair],
  currencyPair => currencyPair,
)

const getSpotTileData = (state: GlobalState, props: SpotTileContainerOwnProps) =>
  state.spotTilesData[props.id]
const selectSpotTileData = createSelector(
  [getSpotTileData],
  spotTileData => spotTileData,
)

const getPricingStatus = (state: GlobalState) =>
  state.compositeStatusService &&
  state.compositeStatusService.pricing &&
  state.compositeStatusService.pricing.connectionStatus
const selectPricingStatus = createSelector(
  [getPricingStatus],
  serviceStatus => serviceStatus,
)

const getExecutionStatus = (state: GlobalState) =>
  state.compositeStatusService &&
  state.compositeStatusService.execution &&
  state.compositeStatusService.execution.connectionStatus
const selectExecutionStatus = createSelector(
  [getExecutionStatus],
  serviceStatus => serviceStatus,
)

export {
  selectNotional,
  selectCurrencyPair,
  selectSpotTileData,
  selectExecutionStatus,
  selectPricingStatus,
}
