import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './combineReducers';

import { blotterEpic } from './blotter/blotterOperations';
import { referenceServiceEpic } from './reference/referenceOperations'

const creatEpicMiddleware = (referenceDataService, blotterService) => createEpicMiddleware(
  combineEpics(
    referenceServiceEpic(referenceDataService.getCurrencyPairUpdatesStream()),
    blotterEpic(blotterService.getTradesStream())
  )

)

export default function configureStore(referenceDataService, blotterService) {
  const epicMiddleware = creatEpicMiddleware(referenceDataService, blotterService)
  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(epicMiddleware)
    )
  )
}
