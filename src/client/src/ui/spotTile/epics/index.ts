import { combineEpics } from 'redux-observable'
import { closePositionEpic } from './closePosition'
import { displayCurrencyChartEpic } from './currencyChartEpic'
import { pricingServiceEpic } from './pricingEpics'
import { publishPriceUpdateEpic } from './publishPrice'
import { spotTileEpic } from './spotTileEpics'
import { publishTradeExecutedEpic } from './tradeExecutedEpic'
import { InteropServices, PlatformAdapter } from 'rt-components'

export default ({ platform }: { platform: PlatformAdapter }) => {
  const { interopServices }: { interopServices: InteropServices } = platform
  const epics = [spotTileEpic, pricingServiceEpic]

  if (interopServices.excel) {
    epics.push(publishPriceUpdateEpic, publishTradeExecutedEpic, closePositionEpic)
  }

  if (interopServices.chartIQ) {
    epics.push(displayCurrencyChartEpic)
  }

  return combineEpics(...epics)
}
