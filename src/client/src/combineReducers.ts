import { combineReducers } from 'redux'

import { blotterServiceReducer } from './ui/blotter/blotterOperations'
import { referenceServiceReducer } from './referenceOperations'
import { pricingServiceReducer } from './pricingOperations'
import compositeStatusServiceReducer from './compositeStatusServiceOperations'
import connectionStatusReducer from './connectionStatusOperations'
import analyticsServiceReducer from './ui/analytics/analyticsOperations'
import sidebarRegionReducer from './ui/sidebar/SidebarRegionOperations'
import footerReducer from './ui/footer/FooterOperations'
import notionalsReducer from './ui/spotTile/notional/NotionalOperations'
import { regionsReducer } from './regions/regionsOperations'
import { spotTileReducer } from './ui/spotTile/spotTileOperations'


const rootReducer = combineReducers({
  blotterService: blotterServiceReducer,
  referenceService: referenceServiceReducer,
  pricingService: pricingServiceReducer,
  analyticsService: analyticsServiceReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  displayAnalytics: sidebarRegionReducer,
  displayStatusServices: footerReducer,
  regionsService: regionsReducer,
  notionals: notionalsReducer,
  spotTiles: spotTileReducer,
})

export default rootReducer
