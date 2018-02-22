import { combineReducers } from 'redux'
import compositeStatusServiceReducer from './compositeStatusServiceOperations'
import connectionStatusReducer from './connectionStatusOperations'
import { currencyPairReducer } from './currencyPairsOperations'
import { pricingServiceReducer } from './pricingOperations'
import { analyticsReducer } from './ui/analytics/index'
import { blotterReducer } from './ui/blotter/index'
import { regionsReducer } from './ui/common/regions/regionsOperations'
import footerReducer from './ui/footer/FooterOperations'
import sidebarRegionReducer from './ui/sidebar/SidebarRegionOperations'
import { spotTileDataReducer } from './ui/spotTile/index'
import notionalsReducer from './ui/spotTile/notional/NotionalOperations'

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

export default rootReducer
