import { Action, applyMiddleware, createStore } from 'redux'
// tslint:disable-next-line:no-submodule-imports
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { platform } from 'rt-platforms'

import { GlobalState } from 'StoreTypes'
import { ApplicationDependencies } from './applicationServices'

import { compositeStatusServiceEpic } from '../data/compositeStatus'
import { connectionStatusEpic } from '../data/connectionStatus'
import { referenceServiceEpic } from '../data/referenceData'

import { createAnalyticsServiceEpic } from '../widgets/analytics/index'
import { createBlotterEpic } from '../widgets/blotter/index'
import { createSpotTileEpic } from '../widgets/spotTile/index'

import rootReducer from './combineReducers'

const platformEpics = platform.epics

export default function configureStore(dependencies: ApplicationDependencies) {
  const epics = [
    ...platformEpics,
    referenceServiceEpic,
    compositeStatusServiceEpic,
    connectionStatusEpic,
    createBlotterEpic(dependencies),
    createAnalyticsServiceEpic(dependencies),
    createSpotTileEpic(dependencies),
  ]

  const middleware = createEpicMiddleware<Action, Action, GlobalState, ApplicationDependencies>({
    dependencies,
  })

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(middleware)))
  middleware.run(combineEpics(...epics))

  return store
}
