import { GlobalState } from 'combineReducers'

export const selectServiceStatus = (state: GlobalState) => state.compositeStatusService
