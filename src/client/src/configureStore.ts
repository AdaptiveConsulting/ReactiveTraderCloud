import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist'

import rootReducer from './redux/reducers/combineReducers'
import { blotterEpic } from './ui/blotter/'
import { referenceServiceEpic } from './redux/actions/referenceDataActions'
import { pricingServiceEpic } from './redux/actions/pricingActions'
import { analyticsServiceEpic } from './ui/analytics/analyticsOperations'
import { compositeStatusServiceEpic } from './redux/reducers/compositeStatusServiceOperations'
import { connectionStatusEpicsCreator } from './connectionStatusOperations'
import { popoutEpic } from './popoutEpic'
import { spotTileEpicsCreator } from './redux/actions/spotTileActions'
import { footerEpic } from './ui/footer/FooterOperations'

const epicMiddleware = (referenceDataService, blotterService, pricingService, analyticsService, compositeStatusService, executionService, openFin) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService),
    blotterEpic(blotterService, openFin),
    pricingServiceEpic(pricingService, openFin, referenceDataService),
    analyticsServiceEpic(analyticsService, openFin),
    compositeStatusServiceEpic(compositeStatusService),
    connectionStatusEpicsCreator(compositeStatusService),
    spotTileEpicsCreator(executionService, referenceDataService, openFin),
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
