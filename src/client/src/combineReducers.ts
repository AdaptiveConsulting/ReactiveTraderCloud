import { combineReducers } from 'redux'
import { currencyPairReducer } from './shell/referenceData'
import { regionsReducer } from './shell/regions'
import { sidebarRegionReducer } from './shell/sidebar'
import { analyticsReducer } from './ui/analytics'
import { blotterReducer } from './ui/blotter'
import { compositeStatusServiceReducer } from './ui/compositeStatus'
import { connectionStatusReducer } from './ui/connectionStatus'
import { footerReducer } from './ui/footer'
import { spotTileDataReducer } from './ui/spotTile'
import { notionalsReducer } from './ui/spotTile/components/notional'

const rootReducer = combineReducers({
  blotterService: blotterReducer,
  currencyPairs: currencyPairReducer,
  analyticsService: analyticsReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  displayAnalytics: sidebarRegionReducer,
  displayStatusServices: footerReducer,
  regionsService: regionsReducer,
  notionals: notionalsReducer,
  spotTilesData: spotTileDataReducer
})

export type GlobalState = ReturnType<typeof rootReducer>

export default rootReducer
