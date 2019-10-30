import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { WindowConfig, WindowPosition } from 'rt-platforms'

type Center = 'screen' | 'parent'
export interface ExternalWindowProps {
  title: string
  config: WindowConfig
  browserConfig: { center: Center }
}

const makeExternalWindowProps: (key: string, tileLayout?: WindowPosition) => ExternalWindowProps = (
  key: string,
  tileLayout: WindowPosition,
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

export const selectSpotTiles = createSelector(
  [getSpotTiles, getSpotTilesLayout],
  (spotTileKeys, tilesLayout) =>
    Object.keys(spotTileKeys).map(key => ({
      key,
      externalWindowProps: makeExternalWindowProps(key, tilesLayout[key]),
      tornOff: tilesLayout[key] === undefined ? false : !tilesLayout[key].visible,
    })),
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
