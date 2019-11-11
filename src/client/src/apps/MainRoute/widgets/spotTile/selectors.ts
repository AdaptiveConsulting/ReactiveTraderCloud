import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { SpotTileContainerOwnProps } from './SpotTileContainer'
import { getDefaultNotionalValue } from './components/Tile/TileBusinessLogic';
import { SpotTileData, SpotTileDataWithNotional } from './model';
import { CurrencyPair } from 'rt-types';

const getCurrencyPair = (state: GlobalState, props: SpotTileContainerOwnProps) =>
  state.currencyPairs[props.id]
const selectCurrencyPair = createSelector(
  [getCurrencyPair],
  currencyPair => currencyPair,
)

function getSpotTileDataWithNotional(spotTileData: SpotTileData, currencyPair: CurrencyPair): SpotTileDataWithNotional {
  const validNotional = typeof spotTileData.notional === 'undefined' ?
    getDefaultNotionalValue(currencyPair) : spotTileData.notional

  return {
    ...spotTileData,
    notional: validNotional
  };
}

const getSpotTileData = (state: GlobalState, props: SpotTileContainerOwnProps) =>
  state.spotTilesData[props.id]
const selectSpotTileData = createSelector(
  [getSpotTileData, getCurrencyPair],
  (spotTileData, currencyPair) => getSpotTileDataWithNotional(spotTileData, currencyPair)
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

export { selectCurrencyPair, selectSpotTileData, selectExecutionStatus, selectPricingStatus }
