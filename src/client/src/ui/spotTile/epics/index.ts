import { combineEpics } from 'redux-observable'
import { from } from 'rxjs'
import { mergeMap, share } from 'rxjs/operators'
import { ApplicationDependencies } from '../../../applicationServices'
import { closePositionEpic } from './closePosition'
import { connectCurrencyChartToOpenFinEpic } from './currencyChartEpic'
import { pricingServiceEpic } from './pricingEpics'
import PricingService from './pricingService'
import { publishPriceToOpenFinEpic } from './publishPrice'
import { spotTileEpic } from './spotTileEpics'
import { connectTradeExecutedToOpenFinEpic } from './tradeExecutedEpic'
export default function epic({ referenceDataService, loadBalancedServiceStub }: ApplicationDependencies) {
  const pricingService = new PricingService(loadBalancedServiceStub)

  const pricesForCurrenciesInRefData = referenceDataService.getCurrencyPairUpdates$().pipe(
    mergeMap(refData =>
      from(Object.values(refData)).pipe(
        mergeMap(refDataForSymbol => {
          console.log(refDataForSymbol.symbol)
          return pricingService.getSpotPriceStream({
            symbol: refDataForSymbol.symbol
          })
        }),
        share()
      )
    )
  )

  const epics = [spotTileEpic, pricingServiceEpic]

  if (typeof fin !== 'undefined') {
    epics.push(
      publishPriceToOpenFinEpic(pricesForCurrenciesInRefData),
      connectTradeExecutedToOpenFinEpic,
      closePositionEpic,
      connectCurrencyChartToOpenFinEpic
    )
  }

  return combineEpics(...epics)
}
