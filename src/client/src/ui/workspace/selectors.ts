import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

const makePortalProps = (key: string) => ({
  title: `${key} Spot`,
  tileView: 'Normal',
  config: {
    name: `${key} Spot`,
    width: 370,
    height: 184,
    url: `/spot/${key}`,
  },
  browserConfig: { center: 'screen' as 'screen' },
})

export type PortalProps = ReturnType<typeof makePortalProps>

const getSpotTiles = (state: GlobalState) => state.currencyPairs
const selectSpotTiles = createSelector([getSpotTiles], spotTileKeys =>
  Object.keys(spotTileKeys).map(key => ({
    key,
    portalProps: makePortalProps(key),
  })),
)

const getExecutionStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.execution && compositeStatusService.execution.connectionStatus
const selectExecutionStatus = createSelector(getExecutionStatus, status => status)

export { selectSpotTiles, selectExecutionStatus }
