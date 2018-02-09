import { combineReducers } from 'redux'
import { blotterReducer } from '../../ui/blotter/'
import { currencyPairReducer } from './currencyPairsReducer'
import { pricingServiceReducer } from './pricingReducer'
import compositeStatusServiceReducer from './compositeStatusServiceOperations'
import connectionStatusReducer from '../../connectionStatusOperations'
import { analyticsReducer } from '../../ui/analytics'
import sidebarRegionReducer from '../../ui/sidebar/SidebarRegionOperations'
import footerReducer from '../../ui/footer/FooterOperations'
import notionalsReducer from '../../ui/spotTile/notional/NotionalOperations'
import { regionsReducer } from '../../regions/regionsOperations'
import { spotTileDataReducer } from '../../ui/spotTile'

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
