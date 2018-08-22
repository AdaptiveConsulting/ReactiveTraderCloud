import { sidebarRegionReducer } from './components/sidebar'
import { compositeStatusServiceReducer } from './compositeStatus'
import { connectionStatusReducer } from './connectionStatus'
import { currencyPairReducer } from './referenceData'
import { regionsReducer } from './regions'

export { Router } from './Router'
export const reducers = {
  regionsService: regionsReducer,
  currencyPairs: currencyPairReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  displayAnalytics: sidebarRegionReducer
}
