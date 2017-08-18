import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'

import rootReducer from './combineReducers'
import { blotterServiceEpic } from '../ui/blotter/blotterOperations'
import { referenceServiceEpic } from './reference/referenceOperations'
import { pricingServiceEpic } from './pricing/pricingOperations'
import { analyticsServiceEpic } from '../ui/analytics/analyticsOperations'
import { compositeStatusServiceEpic } from './compositeStatusService/compositeStatusServiceOperations'
import { connectionStatusEpicsCreator } from './connectionStatus/connectionStatusOperations'
import { popoutEpic } from './popoutEpic'
import { executionServiceEpic } from './execution/executionOperations';

const epicMiddleware = (referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService),
    blotterServiceEpic(blotterService),
    pricingServiceEpic(pricingService),
    analyticsServiceEpic(analyticsService),
    compositeStatusServiceEpic(compositeStatusService),
    connectionStatusEpicsCreator(compositeStatusService),
    executionServiceEpic(executionService),
    popoutEpic(openFin)
  )
)

export default function configureStore(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin) {
  const middleware = epicMiddleware(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin)

  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(middleware)
    )
  )
  persistStore(store)
  return store
}
