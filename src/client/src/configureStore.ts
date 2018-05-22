import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { ApplicationDependencies } from './applicationServices'
import rootReducer from './combineReducers'
import { compositeStatusServiceEpic } from './compositeStatusServiceOperations'
import { connectionStatusEpicsCreator } from './connectionStatusOperations'
import { linkEpic } from './linkEpic'
import { openfinEpic } from './openfinEpics'
import { pricingServiceEpic } from './pricingOperations'
import { referenceServiceEpic } from './referenceDataOperations'
import { analyticsServiceEpic } from './ui/analytics'
import { blotterEpic } from './ui/blotter/'
import { popoutEpic } from './ui/common/popout/popoutEpic'
import { spotTileEpicsCreator } from './ui/spotTile'

export default function configureStore(dependencies: ApplicationDependencies) {
  const epics = [
    referenceServiceEpic,
    blotterEpic,
    pricingServiceEpic,
    analyticsServiceEpic,
    compositeStatusServiceEpic,
    connectionStatusEpicsCreator,
    spotTileEpicsCreator,
    popoutEpic,
    linkEpic
  ]

  if (dependencies.openFin.isRunningInOpenFin) {
    epics.push(openfinEpic)
  }

  const middleware = createEpicMiddleware(combineEpics(...epics), {
    dependencies
  })

  return createStore(rootReducer, composeWithDevTools(applyMiddleware(middleware)))
}
