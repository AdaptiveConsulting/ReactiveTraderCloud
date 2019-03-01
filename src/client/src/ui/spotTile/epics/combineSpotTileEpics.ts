import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePosition'
import { displayCurrencyChartEpic } from './currencyChartEpic'
import { pricingServiceEpic, pricingHistoryEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPrice'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'
import { ApplicationDependencies } from 'applicationServices'

export default ({ platform }: ApplicationDependencies) => {
  const interopServices = platform.interopServices
  const epics = [spotTileEpic, pricingServiceEpic, pricingHistoryEpic]

  if (interopServices.excel) {
    epics.push(publishPriceUpdateEpic, publishTradeExecutedEpic, closePositionEpic)
  }

  if (interopServices.chartIQ) {
    epics.push(displayCurrencyChartEpic)
  }

  return combineEpics(...epics)
}
