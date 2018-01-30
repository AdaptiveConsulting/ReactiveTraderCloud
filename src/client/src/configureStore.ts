import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'
import { compact } from 'lodash'

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
    blotterServiceEpic(blotterService, openFin),
    pricingServiceEpic(pricingService, openFin, referenceDataService),
    analyticsServiceEpic(analyticsService, openFin),
    compositeStatusServiceEpic(compositeStatusService),
    connectionStatusEpicsCreator(compositeStatusService),
    spotTileEpicsCreator(executionService, referenceDataService, openFin),
    popoutEpic(),
    footerEpic(openFin),
  ),
)

const isProduction = process.env.NODE_ENV === 'production'
const enableReduxStateInvariant = false && !isProduction

export default function configureStore(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin) {
  const appEpicMiddleware = epicMiddleware(referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin)
  const middlewares = compact([
    enableReduxStateInvariant ? require('redux-immutable-state-invariant').default() : void 0,
    appEpicMiddleware
  ])
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares)),
  )
  persistStore(store)
  return store
}
