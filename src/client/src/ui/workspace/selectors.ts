import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

const makePortalProps = (key: string) => ({
  title: `${key} Spot`,
  config: {
    name: `${key} Spot`,
    width: 370,
    height: 155,
    url: `about:${key} Spot`
  },
  browserConfig: { center: 'screen' as 'screen' }
})

export type PortalProps = ReturnType<typeof makePortalProps>

const getSpotTiles = (state: GlobalState) => state.currencyPairs
const selectSpotTiles = createSelector([getSpotTiles], spotTileKeys =>
  Object.keys(spotTileKeys).map(key => ({
    key,
    portalProps: makePortalProps(key)
  }))
)

const getPricingStatus = ({ compositeStatusService }: GlobalState) =>
  compositeStatusService.pricing && compositeStatusService.pricing.connectionStatus
const selectPricingStatus = createSelector(getPricingStatus, status => status)

export { selectSpotTiles, selectPricingStatus }
