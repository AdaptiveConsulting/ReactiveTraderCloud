import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './combineReducers';
import { blotterServiceEpic } from './blotter/blotterOperations';
import { referenceServiceEpic } from './reference/referenceOperations'
import { pricingServiceEpic } from './pricing/pricingOperations'
import { analyticsServiceEpic } from './analytics/analyticsOperations';
import { compositeStatusServiceEpic } from './compositeStatusService/compositeStatusServiceOperations';

const creatEpicMiddleware = (referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService),
    blotterServiceEpic(blotterService),
    pricingServiceEpic(pricingService),
    analyticsServiceEpic(analyticsService),
    compositeStatusServiceEpic(compositeStatusService)
  )
)

export default function configureStore(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService) {
  const epicMiddleware = creatEpicMiddleware(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService)
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(epicMiddleware)
    )
  )
}
