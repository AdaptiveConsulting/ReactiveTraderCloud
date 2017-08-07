import { combineReducers } from 'redux'
import { blotterServiceReducer } from './blotter/blotterOperations'
import { referenceServiceReducer } from './reference/referenceOperations';

const roodReducer = combineReducers({
  blotterService: blotterServiceReducer,
  referenceService: referenceServiceReducer
})

export default roodReducer
