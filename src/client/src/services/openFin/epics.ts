import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './epics/closePosition'
import { connectCurrencyChartToOpenFinEpic } from './epics/currencyChartEpic'
import { openLinkWithOpenFinEpic } from './epics/openLinkInBrowser'
import { publishPriceToOpenFinEpic } from './epics/publishPrice'
import { connectTradeExecutedToOpenFinEpic } from './epics/tradeExecutedEpic'

export const openfinEpic = combineEpics(
  connectCurrencyChartToOpenFinEpic,
  connectTradeExecutedToOpenFinEpic,
  publishPriceToOpenFinEpic,
  closePositionEpic,
  openLinkWithOpenFinEpic
)
