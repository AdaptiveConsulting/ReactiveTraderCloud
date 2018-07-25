import { combineReducers } from 'redux'
import { currencyPairReducer } from './operations/referenceData'
import { analyticsReducer } from './ui/analytics'
import { blotterReducer } from './ui/blotter'
import { compositeStatusServiceReducer } from './ui/compositeStatus'
import { connectionStatusReducer } from './ui/connectionStatus'
import { footerReducer } from './ui/footer'
import { regionsReducer } from './ui/shell/regions'
import { sidebarRegionReducer } from './ui/shell/sidebar'
import { spotTileDataReducer } from './ui/spotTile'
import { notionalsReducer } from './ui/spotTile/components/notional'
import { themeReducer } from './ui/theme'

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
  spotTilesData: spotTileDataReducer,
  theme: themeReducer
})

export type GlobalState = ReturnType<typeof rootReducer>

export default rootReducer
