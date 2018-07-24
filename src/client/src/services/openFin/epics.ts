import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './epics/closePosition'
import { connectCurrencyChartToOpenFinEpic } from './epics/currencyChartEpic'
import { openLinkWithOpenFinEpic } from './epics/openLinkInBrowser'

export const openfinEpic = combineEpics(connectCurrencyChartToOpenFinEpic, closePositionEpic, openLinkWithOpenFinEpic)
