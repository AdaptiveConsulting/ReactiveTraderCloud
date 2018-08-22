import { combineReducers } from 'redux'
import { sidebarRegionReducer } from 'shell/components/sidebar'
import { currencyPairReducer } from 'shell/referenceData'
import { regionsReducer } from 'shell/regions'
import { analyticsReducer } from 'ui/analytics'
import { blotterReducer } from 'ui/blotter'
import { compositeStatusServiceReducer } from 'ui/compositeStatus'
import { connectionStatusReducer } from 'ui/connectionStatus'
import { spotTileDataReducer } from 'ui/spotTile'

const rootReducer = combineReducers({
  blotterService: blotterReducer,
  currencyPairs: currencyPairReducer,
  analyticsService: analyticsReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  displayAnalytics: sidebarRegionReducer,
  regionsService: regionsReducer,
  spotTilesData: spotTileDataReducer
})

export type GlobalState = ReturnType<typeof rootReducer>

export default rootReducer
