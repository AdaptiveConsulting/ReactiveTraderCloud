import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePosition'
import { displayCurrencyChartEpic } from './currencyChartEpic'
import { pricingServiceEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPrice'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'

const epics = [spotTileEpic, pricingServiceEpic]

if (typeof window.FSBL === 'undefined' && typeof fin !== 'undefined') {
  epics.push(publishPriceUpdateEpic, publishTradeExecutedEpic, closePositionEpic, displayCurrencyChartEpic)
}

export default combineEpics(...epics)
