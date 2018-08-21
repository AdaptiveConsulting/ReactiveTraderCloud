import { Action, applyMiddleware, createStore } from 'redux'
// tslint:disable-next-line:no-submodule-imports
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { GlobalState } from 'StoreTypes'
import { ApplicationDependencies } from './applicationServices'
import rootReducer from './combineReducers'
import { compositeStatusServiceEpic } from './shell/compositeStatus'
import { connectionStatusEpic } from './shell/connectionStatus'
import { linkEpic } from './shell/epics'
import { openfinEpic } from './shell/openFin/epics'
import { referenceServiceEpic } from './shell/referenceData'
import { analyticsServiceEpic } from './ui/analytics'
import { blotterEpic } from './ui/blotter/'
import { spotTileEpic } from './ui/spotTile'

export default function configureStore(dependencies: ApplicationDependencies) {
  const epics = [
    referenceServiceEpic,
    blotterEpic,
    linkEpic,
    analyticsServiceEpic,
    compositeStatusServiceEpic,
    connectionStatusEpic,
    spotTileEpic(dependencies)
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
