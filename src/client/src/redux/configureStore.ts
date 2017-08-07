import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { pricingReducer } from './reducers'
import { pricingEpic } from './epics'

const epicMiddleware = createEpicMiddleware(pricingEpic);

export default function configureStore() {
  const store = createStore(
    pricingReducer,
    applyMiddleware(epicMiddleware)
  )

  return store
}
