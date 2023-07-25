import { map, scan, share } from 'rxjs/operators'
import { ServiceStub, WsConnection } from './connection'
import { convertToPrice, Price, RawPrice, TradeUpdate } from './domain'
import logger from './logger'

function getPriceMovementType(prevItem: Price, newItem: Price) {
  const prevPriceMove = prevItem.lastMove
  const lastPrice = prevItem.mid
  const nextPrice = newItem.mid
  if (lastPrice < nextPrice) {
    return 'up'
  }
  if (lastPrice > nextPrice) {
    return 'down'
  }
  return prevPriceMove
}

export function createApplicationServices(host: string, port: string) {
  logger.info(`Started bot-service for ${host}:${port}`)

  const broker = new WsConnection(host, +port)
  const stub = new ServiceStub('RT-Bot', broker)

  const tradeStream$ = stub
    .createStreamOperation<TradeUpdate>('blotter', 'getTradesStream', {})
    .pipe(share())

  const priceSubsription$ = stub.subscribeToTopic<RawPrice>('prices').pipe(
    map(price => convertToPrice(price)),
    scan<Price, Map<string, Price>>((acc, price) => {
      if (acc.has(price.symbol)) {
        price.lastMove = getPriceMovementType(acc.get(price.symbol)!, price)
      }
      return acc.set(price.symbol, price)
    }, new Map<string, Price>()),
    share()
  )

  return { tradeStream$, priceSubsription$ }
}

export type RTServices = ReturnType<typeof createApplicationServices>
