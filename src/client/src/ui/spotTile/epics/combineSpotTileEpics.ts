import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePositionEpic'
import { displayCurrencyChartEpic } from './currencyChartEpic'
import { pricingServiceEpic, pricingHistoryEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPriceUpdateEpic'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'
import { ApplicationDependencies } from 'applicationServices'
import { rfqRequestEpic, rfqReceivedEpic } from './rfqEpics'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [
    spotTileEpic,
    rfqRequestEpic,
    rfqReceivedEpic,
    pricingServiceEpic,
    pricingHistoryEpic,
  ]

  if (platform.hasFeature('interop')) {
    epics.push(publishPriceUpdateEpic, publishTradeExecutedEpic, closePositionEpic)
  }

  if (platform.hasFeature('chartIQ')) {
    epics.push(displayCurrencyChartEpic)
  }

  return combineEpics(...epics)
}
