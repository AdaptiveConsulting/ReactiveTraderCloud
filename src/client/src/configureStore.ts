import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'

import rootReducer from './combineReducers'
import { blotterServiceEpic } from './ui/blotter/blotterOperations'
import { referenceServiceEpic } from './referenceOperations'
import { pricingServiceEpic } from './pricingOperations'
import { analyticsServiceEpic } from './ui/analytics/analyticsOperations'
import { compositeStatusServiceEpic } from './compositeStatusServiceOperations'
import { connectionStatusEpicsCreator } from './connectionStatusOperations'
import { popoutEpic } from './popoutEpic'
import { spotTileEpicsCreator } from './ui/spotTile/spotTileOperations'
import { footerEpic } from './ui/footer/FooterOperations'

const epicMiddleware = (referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService),
    blotterServiceEpic(blotterService),
    pricingServiceEpic(pricingService),
    analyticsServiceEpic(analyticsService),
    compositeStatusServiceEpic(compositeStatusService),
    connectionStatusEpicsCreator(compositeStatusService),
    spotTileEpicsCreator(executionService, pricingService, referenceDataService),
    popoutEpic(),
    footerEpic(openFin),
  ),
)

export default function configureStore(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin) {
  const middleware = epicMiddleware(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin)

  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(middleware),
    ),
  )
  persistStore(store)
  return store
}
