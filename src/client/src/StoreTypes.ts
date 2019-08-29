import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { ApplicationDependencies } from './apps/MainRoute/store/applicationServices'
import rootReducer from './apps/MainRoute/store/combineReducers'

export type GlobalState = ReturnType<typeof rootReducer>
export type ApplicationEpic<
  R extends Partial<ApplicationDependencies> = ApplicationDependencies,
  T extends Action = Action
> = Epic<T, T, GlobalState, R>
