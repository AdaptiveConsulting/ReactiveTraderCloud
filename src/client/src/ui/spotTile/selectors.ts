import { GlobalState } from 'combineReducers'
import { createSelector } from 'reselect'
import { selectServiceStatus } from 'ui/compositeStatus'
import { SpotTileContainerOwnProps } from './SpotTileContainer'

const getCurrencyPair = (state: GlobalState, props: SpotTileContainerOwnProps) => state.currencyPairs[props.id]
const selectCurrencyPair = createSelector([getCurrencyPair], currencyPair => currencyPair)

const getSpotTileData = (state: GlobalState, props: SpotTileContainerOwnProps) => state.spotTilesData[props.id]
const selectSpotTileData = createSelector([getSpotTileData], spotTileData => spotTileData)

const selectExecutionStatus = createSelector(
  [selectServiceStatus],
  serviceStatus => serviceStatus.execution && serviceStatus.execution.isConnected
)

const selectPricingStatus = createSelector(
  [selectServiceStatus],
  serviceStatus => serviceStatus.pricing && serviceStatus.pricing.isConnected
)

export { selectCurrencyPair, selectSpotTileData, selectExecutionStatus, selectPricingStatus }
