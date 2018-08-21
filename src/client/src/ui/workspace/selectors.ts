import { GlobalState } from 'combineReducers'
import { createSelector } from 'reselect'

const makePortalProps = (key: string) => ({
  title: `${key} Spot`,
  config: {
    name: `${key} Spot`,
    width: 370,
    height: 155,
    url: 'about:`${key} Spot`'
  },
  browserConfig: { center: 'screen' as 'screen' }
})

const getSpotTiles = (state: GlobalState) => state.currencyPairs

export const selectSpotTiles = createSelector([getSpotTiles], spotTileKeys =>
  Object.keys(spotTileKeys).map(key => ({
    key,
    portalProps: makePortalProps(key)
  }))
)
