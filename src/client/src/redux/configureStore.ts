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
import { connectionStatusEpic } from './connectionStatus/connectionStatusOperations'
import { popoutEpic } from './popoutEpic'

const epicMiddleware = (referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, openFin) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService),
    blotterServiceEpic(blotterService),
    pricingServiceEpic(pricingService),
    analyticsServiceEpic(analyticsService),
    compositeStatusServiceEpic(compositeStatusService),
    connectionStatusEpic(compositeStatusService),
    popoutEpic(openFin)
  )
)

export default function configureStore(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, openFin) {
  const middleware = epicMiddleware(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, openFin)

  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(middleware)
    )
  )
  persistStore(store)
  return store
}
