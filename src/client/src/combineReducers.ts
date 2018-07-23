import { combineReducers } from 'redux'
import { pricingServiceReducer } from './operations/pricing'
import { currencyPairReducer } from './operations/referenceData'
import { analyticsReducer } from './ui/analytics'
import { blotterReducer } from './ui/blotter'
import { regionsReducer } from './ui/common/regions'
import { compositeStatusServiceReducer } from './ui/compositeStatus'
import { connectionStatusReducer } from './ui/connectionStatus'
import { footerReducer } from './ui/footer'
import { sidebarRegionReducer } from './ui/sidebar'
import { spotTileDataReducer } from './ui/spotTile'
import { notionalsReducer } from './ui/spotTile/notional'

const rootReducer = combineReducers({
  blotterService: blotterReducer,
  currencyPairs: currencyPairReducer,
  pricingService: pricingServiceReducer,
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
