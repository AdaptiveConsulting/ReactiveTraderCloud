import { combineReducers } from 'redux'
import { enviromentReducer } from './enviromentReducer'
import { compositeStatusServiceReducer } from './operations/compositeStatusService'
import { connectionStatusReducer } from './operations/connectionStatus'
import { currencyPairReducer } from './operations/currencyPairs'
import { pricingServiceReducer } from './operations/pricing'
import { analyticsReducer } from './ui/analytics'
import { blotterReducer } from './ui/blotter'
import { regionsReducer } from './ui/common/regions/regionsOperations'
import footerReducer from './ui/footer/FooterOperations'
import { sidebarRegionReducer } from './ui/sidebar'
import { spotTileDataReducer } from './ui/spotTile'
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
  spotTilesData: spotTileDataReducer,
  environment: enviromentReducer
})

export type GlobalState = ReturnType<typeof rootReducer>

export default rootReducer
