import { combineEpics } from 'redux-observable'
import { connectAnalyticsServiceToOpenFinEpic } from './epics/analyticsServiceEpic'
import { connectBlotterServiceToOpenFinEpic } from './epics/blotterServiceEpic'
import { closePositionEpic } from './epics/closePosition'
import { connectCurrencyChartToOpenFinEpic } from './epics/currencyChartEpic'
import { openLinkWithOpenFinEpic } from './epics/openLinkInBrowser'
import { publishPriceToOpenFinEpic } from './epics/publishPrice'
import { connectTradeExecutedToOpenFinEpic } from './epics/tradeExecutedEpic'

export const openfinEpic = combineEpics(
  connectAnalyticsServiceToOpenFinEpic,
  connectBlotterServiceToOpenFinEpic,
  connectCurrencyChartToOpenFinEpic,
  connectTradeExecutedToOpenFinEpic,
  publishPriceToOpenFinEpic,
  closePositionEpic,
  openLinkWithOpenFinEpic
)
