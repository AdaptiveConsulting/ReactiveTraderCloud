import { createSelector } from 'reselect'
import { ServiceConnectionStatus } from 'rt-types'
import { GlobalState } from 'StoreTypes'
import { SpotTileContainerOwnProps } from './SpotTileContainer'

const getCurrencyPair = (state: GlobalState, props: SpotTileContainerOwnProps) => state.currencyPairs[props.id]
const selectCurrencyPair = createSelector([getCurrencyPair], currencyPair => currencyPair)

const getSpotTileData = (state: GlobalState, props: SpotTileContainerOwnProps) => state.spotTilesData[props.id]
const selectSpotTileData = createSelector([getSpotTileData], spotTileData => spotTileData)

const selectServiceStatus = (state: GlobalState) => state.compositeStatusService

const selectExecutionStatus = createSelector(
  [selectServiceStatus],
  serviceStatus =>
    serviceStatus.execution && serviceStatus.execution.connectionStatus === ServiceConnectionStatus.CONNECTED
)

const selectPricingStatus = createSelector(
  [selectServiceStatus],
  serviceStatus => serviceStatus.pricing && serviceStatus.pricing.connectionStatus === ServiceConnectionStatus.CONNECTED
)

export { selectCurrencyPair, selectSpotTileData, selectExecutionStatus, selectPricingStatus }
