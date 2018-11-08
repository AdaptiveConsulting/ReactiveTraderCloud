import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePosition'
import { connectCurrencyChartToOpenFinEpic } from './currencyChartEpic'
import { pricingServiceEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPrice'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'

const epics = [spotTileEpic, pricingServiceEpic]

if (typeof fin !== 'undefined') {
  epics.push(publishPriceUpdateEpic, publishTradeExecutedEpic, closePositionEpic, connectCurrencyChartToOpenFinEpic)
}

export default combineEpics(...epics)
