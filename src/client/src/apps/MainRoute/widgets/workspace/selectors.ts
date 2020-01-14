import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { WindowConfig, WindowPosition } from 'rt-platforms'
import { SpotTileState } from '../spotTile/spotTileDataReducer'

type Center = 'screen' | 'parent'
export interface ExternalWindowProps {
  title: string
  config: WindowConfig
  browserConfig: { center: Center }
}

const makeExternalWindowProps: (key: string, tileLayout?: WindowPosition) => ExternalWindowProps = (
  key: string,
  tileLayout?: WindowPosition,
) => ({
  title: `${key} Spot`,
  config: {
    name: `${key}`,
    width: 366, // 346 content + 10 padding
    height: 193,
    minWidth: 366,
    minHeight: 193,
    maxWidth: 366,
    maxHeight: 193,
    url: `/spot/${key}`,
    x: tileLayout ? tileLayout.x : undefined,
    y: tileLayout ? tileLayout.y : undefined,
  },
  browserConfig: { center: 'screen' },
})

const getSpotTiles = (state: GlobalState) => state.currencyPairs
const getSpotTilesLayout = (state: GlobalState) => state.layoutService.spotTiles
const getSpotTilesData = (state: GlobalState) => state.spotTilesData

const spotTilesDataTypeChecker = (spotTilesData: SpotTileState, key: string) => typeof spotTilesData !== 'undefined' && typeof spotTilesData[key] !== 'undefined'

// TODO: instead of creating tiles in the selector, consider creating them in the reducer for
  // reference data
export const selectSpotTiles = createSelector(
  [getSpotTiles, getSpotTilesLayout, getSpotTilesData],
  (spotTileKeys, tilesLayout, spotTilesData) =>
    Object.keys(spotTileKeys).map(key => ({
      key,
      externalWindowProps: makeExternalWindowProps(key, tilesLayout[key]),
      tornOff: tilesLayout[key] === undefined ? false : !tilesLayout[key].visible,
      rfqState: spotTilesDataTypeChecker(spotTilesData, key) ? spotTilesData[key]!.rfqState : 'none',
      rfqPrice: spotTilesDataTypeChecker(spotTilesData, key) ? spotTilesData[key]!.rfqPrice : null,
      rfqReceivedTime: spotTilesDataTypeChecker(spotTilesData, key) ? spotTilesData[key]!.rfqReceivedTime : null, 
      rfqTimeout: spotTilesDataTypeChecker(spotTilesData, key) ? spotTilesData[key]!.rfqTimeout : null,
      notional: spotTilesDataTypeChecker(spotTilesData, key) ? spotTilesData[key]!.notional : undefined,
    }))
)

export const selectSpotCurrencies = createSelector(
  [getSpotTiles],
  spotTileKeys => Array.from(new Set(Object.keys(spotTileKeys).map(key => spotTileKeys[key].base))),
)

const getExecutionStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.execution && compositeStatusService.execution.connectionStatus

export const selectExecutionStatus = createSelector(
  getExecutionStatus,
  status => status,
)
