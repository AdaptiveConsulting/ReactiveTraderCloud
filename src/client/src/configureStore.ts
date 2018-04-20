import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { persistStore } from 'redux-persist'

import rootReducer from './combineReducers'
import { compositeStatusServiceEpic } from './compositeStatusServiceOperations'
import { connectionStatusEpicsCreator } from './connectionStatusOperations'
import { pricingServiceEpic } from './pricingOperations'
import { referenceServiceEpic } from './referenceDataOperations'
import { analyticsServiceEpic } from './ui/analytics'
import { blotterEpic } from './ui/blotter/'
import { popoutEpic } from './ui/common/popout/popoutEpic'
import { footerEpic } from './ui/footer/FooterOperations'
import { spotTileEpicsCreator } from './ui/spotTile'

const epicMiddleware = (
  referenceDataService,
  blotterService,
  pricingService,
  analyticsService,
  compositeStatusService,
  executionService,
  openFin
) =>
  createEpicMiddleware(
    combineEpics(
      referenceServiceEpic(referenceDataService),
      blotterEpic(blotterService, openFin),
      pricingServiceEpic(pricingService, openFin, referenceDataService),
      analyticsServiceEpic(analyticsService, openFin),
      compositeStatusServiceEpic(compositeStatusService),
      connectionStatusEpicsCreator(compositeStatusService),
      spotTileEpicsCreator(executionService, referenceDataService, openFin),
      popoutEpic(),
      footerEpic(openFin)
    )
  )

export default function configureStore(
  referenceDataService,
  blotterService,
  pricingService,
  analyticsService,
  compositeStatusService,
  executionService,
  openFin
) {
  const middleware = epicMiddleware(
    referenceDataService,
    blotterService,
    pricingService,
    analyticsService,
    compositeStatusService,
    executionService,
    openFin
  )

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(middleware)))
  persistStore(store)

  return store
}
