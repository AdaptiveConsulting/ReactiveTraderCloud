import { Action, applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { ApplicationDependencies } from './applicationServices'
import rootReducer, { GlobalState } from './combineReducers'
import { pricingServiceEpic } from './operations/pricing'
import { referenceServiceEpic } from './operations/referenceData'
import { openfinEpic } from './services/openFin/epics'
import { analyticsServiceEpic } from './ui/analytics'
import { blotterEpic } from './ui/blotter/'
import { compositeStatusServiceEpic } from './ui/compositeStatus'
import { connectionStatusEpic } from './ui/connectionStatus'
import { linkEpic } from './ui/footer'
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
