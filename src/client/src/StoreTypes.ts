import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { ApplicationDependencies } from './applicationServices'
import rootReducer from './combineReducers'

export type GlobalState = ReturnType<typeof rootReducer>
export type ApplicationEpic<
  R extends Partial<ApplicationDependencies> = ApplicationDependencies,
  T extends Action = Action
> = Epic<T, T, GlobalState, R>
