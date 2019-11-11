import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePositionEpic'
import { displayCurrencyChartEpic } from './currencyChartEpic'
import { pricingServiceEpic, pricingHistoryEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPriceUpdateEpic'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'
import { ApplicationDependencies } from 'apps/MainRoute/store/applicationServices'
import { rfqRequestEpic, rfqReceivedEpic } from './rfqEpics'
import { platformHasFeature } from 'rt-platforms'

export default ({ platform }: ApplicationDependencies) => {
  const epics = [
    spotTileEpic,
    rfqRequestEpic,
    rfqReceivedEpic,
    pricingServiceEpic,
    pricingHistoryEpic,
  ]

  if (platformHasFeature(platform, 'interop')) {
    epics.push(publishPriceUpdateEpic, publishTradeExecutedEpic, closePositionEpic)
  }

  if (platformHasFeature(platform, 'app')) {
    epics.push(displayCurrencyChartEpic)
  }

  return combineEpics(...epics)
}
