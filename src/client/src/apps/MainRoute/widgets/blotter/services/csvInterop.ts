import { excelApp, referenceDataService$ } from 'apps/MainRoute/store/singleServices'
import { CurrencyPairMap, Trades } from 'rt-types'
import { combineLatest, interval } from 'rxjs'
import { sample } from 'rxjs/operators'
import { rows$ } from './tradeService'
import { formatTradeNotification } from './tradeFormatter'

function parseBlotterData(blotterData: Trades, currencyPairs: CurrencyPairMap) {
  if (Object.keys(currencyPairs).length === 0 || Object.keys(blotterData).length === 0) {
    return []
  }
  return Object.keys(blotterData).map(key =>
    formatTradeNotification(blotterData[key], currencyPairs[blotterData[key].symbol])
  )
}

combineLatest(rows$.pipe(sample(interval(7500))), referenceDataService$, excelApp).subscribe(
  ([trades, currencyPairs, excel]) => {
    if (excel.isOpen()) {
      const parsedData = parseBlotterData(trades, currencyPairs)
      excel.publishBlotter(parsedData)
    }
  }
)
