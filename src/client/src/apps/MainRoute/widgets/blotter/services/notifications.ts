import { referenceDataService$, runningPlatform } from 'apps/MainRoute/store/singleServices'
import { TradeStatus } from 'rt-types'
import { combineLatest } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'
import { formatTradeNotification } from './tradeFormatter'
import { newTrades$ } from './tradeService'

const notifications = newTrades$.pipe(
  filter(update => !update.isStale && update.trades.length > 0),
  map(update => update.trades[0]),
  filter(trade => trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected),
  mergeMap(trade =>
    referenceDataService$.pipe(
      filter(currencyPairs => !!currencyPairs[trade.symbol]),
      map(currencyPairs => formatTradeNotification(trade, currencyPairs[trade.symbol]))
    )
  )
)

combineLatest(notifications, runningPlatform).subscribe(([tradeNotification, platform]) => {
  platform.notification.notify({ tradeNotification })
})

if ('Notification' in window) {
  Notification.requestPermission()
}
