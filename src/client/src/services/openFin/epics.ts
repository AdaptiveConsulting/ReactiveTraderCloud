import { combineEpics } from 'redux-observable'
import { connectAnalyticsServiceToOpenFinEpic } from './epics/analyticsServiceEpic'
import { connectBlotterServiceToOpenFinEpic } from './epics/blotterServiceEpic'
import { displayCurrencyChartEpic } from './epics/displayCurrencyChartEpic'

export const openfinServiceEpics = combineEpics(
  connectAnalyticsServiceToOpenFinEpic,
  connectBlotterServiceToOpenFinEpic,
  displayCurrencyChartEpic
)
