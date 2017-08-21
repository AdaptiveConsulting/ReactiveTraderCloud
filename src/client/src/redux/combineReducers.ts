import { combineReducers } from 'redux'

import { blotterServiceReducer } from './blotter/blotterOperations'
import { referenceServiceReducer } from './reference/referenceOperations';
import { pricingServiceReducer } from './pricing/pricingOperations';
import { analyticsServiceReducer } from './analytics/analyticsOperations';
import { compositeStatusServiceReducer } from './compositeStatusService/compositeStatusServiceOperations';

const rootReducer = combineReducers({
  blotterService: blotterServiceReducer,
  referenceService: referenceServiceReducer,
  pricingService: pricingServiceReducer,
  analyticsService: analyticsServiceReducer,
  compositeStatusService: compositeStatusServiceReducer
})

export default rootReducer
