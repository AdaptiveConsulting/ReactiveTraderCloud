import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './combineReducers';
import { blotterEpic } from './blotter/blotterOperations';
import { referenceServiceEpic } from './reference/referenceOperations'
import { pricingEpic } from './pricing/pricingOperations'

const creatEpicMiddleware = (referenceDataService, blotterService, pricingService) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService.getCurrencyPairUpdatesStream()),
    blotterEpic(blotterService),
    pricingEpic(pricingService)
  )
)

export default function configureStore(referenceDataService, blotterService, pricingService) {
  const epicMiddleware = creatEpicMiddleware(referenceDataService, blotterService, pricingService)
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(epicMiddleware)
    )
  )
}
