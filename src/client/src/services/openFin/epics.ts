import { combineEpics } from 'redux-observable'
import { connectAnalyticsServiceToOpenFinEpic } from './epics/analyticsServiceEpic'
import { connectBlotterServiceToOpenFinEpic } from './epics/blotterServiceEpic'
import { connectCurrencyChartToOpenFinEpic } from './epics/currencyChartEpic'
import { connectTradeExecutedToOpenFinEpic } from './epics/tradeExecutedEpic'

export const openfinServiceEpics = combineEpics(
  connectAnalyticsServiceToOpenFinEpic,
  connectBlotterServiceToOpenFinEpic,
  connectCurrencyChartToOpenFinEpic,
  connectTradeExecutedToOpenFinEpic
)
