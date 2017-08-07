import { combineReducers } from 'redux'

import { blotterServiceReducer } from './blotter/blotterOperations'
import { referenceServiceReducer } from './reference/referenceOperations';
import { pricingServiceReducer } from './pricing/pricingOperations';

const roodReducer = combineReducers({
  blotterService: blotterServiceReducer,
  referenceService: referenceServiceReducer,
  pricingService: pricingServiceReducer
})

export default roodReducer
