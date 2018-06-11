import { combineEpics } from 'redux-observable'
import { connectAnalyticsServiceToOpenFinEpic } from './epics/analyticsServiceEpic'
import { connectBlotterServiceToOpenFinEpic } from './epics/blotterServiceEpic'

export const openfinServiceEpics = combineEpics(
  connectAnalyticsServiceToOpenFinEpic,
  connectBlotterServiceToOpenFinEpic
)
