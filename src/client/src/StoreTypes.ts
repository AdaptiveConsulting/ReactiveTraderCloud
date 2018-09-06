import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { ApplicationDependencies } from './applicationServices'
import rootReducer from './combineReducers'

export type GlobalState = ReturnType<typeof rootReducer>
export type ApplicationEpic<T extends Action = Action> = Epic<T, T, GlobalState, ApplicationDependencies>
