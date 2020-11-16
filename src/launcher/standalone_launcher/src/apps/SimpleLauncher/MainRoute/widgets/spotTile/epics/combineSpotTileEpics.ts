import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePositionEpic'
import { pricingServiceEpic, pricingHistoryEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPriceUpdateEpic'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'
import { ApplicationDependencies } from 'apps/SimpleLauncher/MainRoute/store/applicationServices'
import { rfqRequestEpic, rfqReceivedEpic } from './rfqEpics'
import { platformHasFeature } from 'rt-platforms'

const doCombine = ({ platform }: ApplicationDependencies) => {
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

  return combineEpics(...epics)
}

export default doCombine
