import { Action } from 'redux'
import { Epic } from 'redux-observable'
import { ApplicationDependencies } from './applicationServices'
import { GlobalState } from './combineReducers'

export type ApplicationEpic<T extends Action = Action> = Epic<T, GlobalState, ApplicationDependencies>
