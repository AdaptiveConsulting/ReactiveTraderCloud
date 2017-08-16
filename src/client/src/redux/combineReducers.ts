import { combineReducers } from 'redux'

import { blotterServiceReducer } from './blotter/blotterOperations'
import { referenceServiceReducer } from './reference/referenceOperations';
import { pricingServiceReducer } from './pricing/pricingOperations';
import compositeStatusServiceReducer from './compositeStatusService/compositeStatusServiceOperations';
import connectionStatusReducer from './connectionStatus/connectionStatusOperations';
import analyticsServiceReducer from './analytics/analyticsOperations';
import sidebarRegionReducer from '../ui/sidebar/SidebarRegionOperations';
import footerReducer from '../ui/footer/FooterOperations';
import { regionsReducer } from "./regions/regionsOperations"


const rootReducer = combineReducers({
  blotterService: blotterServiceReducer,
  referenceService: referenceServiceReducer,
  pricingService: pricingServiceReducer,
  analyticsService: analyticsServiceReducer,
  compositeStatusService: compositeStatusServiceReducer,
  connectionStatus: connectionStatusReducer,
  displayAnalytics: sidebarRegionReducer,
  displayStatusServices: footerReducer,
  regionsService: regionsReducer
})

export default rootReducer
