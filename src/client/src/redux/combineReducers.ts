import { combineReducers } from 'redux'

import { blotterServiceReducer } from './blotter/blotterOperations'
import { referenceServiceReducer } from './reference/referenceOperations';
import { pricingServiceReducer } from './pricing/pricingOperations';
import { compositeStatusServiceReducer } from './compositeStatusService/compositeStatusServiceOperations';
import analyticsServiceReducer from './analytics/analyticsOperations';
import sidebarRegionReducer from '../ui/regions/views/sidebar/SidebarRegionOperations';

const rootReducer = combineReducers({
  blotterService: blotterServiceReducer,
  referenceService: referenceServiceReducer,
  pricingService: pricingServiceReducer,
  analyticsService: analyticsServiceReducer,
  compositeStatusService: compositeStatusServiceReducer,
  displayAnalytics: sidebarRegionReducer
})

export default rootReducer
