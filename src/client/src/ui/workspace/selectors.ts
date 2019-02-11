import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'
import { WindowConfig } from 'rt-components'

type Center = 'screen' | 'parent'
export interface ExternalWindowProps {
  title: string
  config: WindowConfig
  browserConfig: { center: Center }
}

const makeExternalWindowProps: (key: string) => ExternalWindowProps = (key: string) => ({
  title: `${key} Spot`,
  config: {
    name: `${key} Spot`,
    width: 370,
    height: 184,
    url: `/spot/${key}`,
  },
  browserConfig: { center: 'screen' },
})

const getSpotTiles = (state: GlobalState) => state.currencyPairs
const selectSpotTiles = createSelector(
  [getSpotTiles],
  spotTileKeys =>
    Object.keys(spotTileKeys).map(key => ({
      key,
      externalWindowProps: makeExternalWindowProps(key),
    })),
)

const getExecutionStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.execution && compositeStatusService.execution.connectionStatus
const selectExecutionStatus = createSelector(
  getExecutionStatus,
  status => status,
)

export { selectSpotTiles, selectExecutionStatus }
