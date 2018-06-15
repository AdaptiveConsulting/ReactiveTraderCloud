import { Action, applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { ApplicationDependencies } from './applicationServices'
import rootReducer, { GlobalState } from './combineReducers'
import { connectionStatusEpic } from './connectionStatusOperations'
import { linkEpic } from './linkEpic'
import { openfinEpic } from './openfinEpics'
import { compositeStatusServiceEpic } from './operations/compositeStatusService'
import { pricingServiceEpic } from './operations/pricing'
import { referenceServiceEpic } from './referenceDataOperations'
import { analyticsServiceEpic } from './ui/analytics'
import { blotterEpic } from './ui/blotter/'
import { popoutEpic } from './ui/common/popout/popoutEpic'
import { spotTileEpic } from './ui/spotTile'

export default function configureStore(dependencies: ApplicationDependencies) {
  const epics = [
    referenceServiceEpic,
    blotterEpic,
    pricingServiceEpic,
    analyticsServiceEpic,
    compositeStatusServiceEpic,
    connectionStatusEpic,
    spotTileEpic,
    popoutEpic,
    linkEpic
  ]

  if (dependencies.openFin.isRunningInOpenFin) {
    epics.push(openfinEpic)
  }

  const middleware = createEpicMiddleware<Action, Action, GlobalState, ApplicationDependencies>({
    dependencies
  })

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(middleware)))
  middleware.run(combineEpics(...epics))

  return store
}
