import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePosition'
import { connectCurrencyChartToOpenFinEpic } from './currencyChartEpic'
import { pricingServiceEpic } from './pricingEpics'
import { publishPriceToOpenFinEpic } from './publishPrice'
import { spotTileEpic } from './spotTileEpics'
import { connectTradeExecutedToOpenFinEpic } from './tradeExecutedEpic'

const epics = [spotTileEpic, pricingServiceEpic]

if (typeof fin !== 'undefined') {
  epics.push(
    publishPriceToOpenFinEpic,
    connectTradeExecutedToOpenFinEpic,
    closePositionEpic,
    connectCurrencyChartToOpenFinEpic
  )
}

export default combineEpics(...epics)
