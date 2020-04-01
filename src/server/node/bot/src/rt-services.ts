import { ReplaySubject } from 'rxjs'
import { map, multicast, refCount, scan, share } from 'rxjs/operators'
import { WsConnectionProxy, ServiceStub } from './connection'
import { ServiceCollectionMap } from './connection/ServiceInstanceCollection'
import { serviceStatusStream$ } from './connection/serviceStatusStream'
import { convertToPrice, Price, RawPrice, RawServiceStatus, TradeUpdate } from './domain'
import logger from './logger'
import ServiceStubWrapper from 'connection/ServiceStubWrapper'

const HEARTBEAT_TIMEOUT = 3000

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

  const broker = new WsConnectionProxy(host, +port)
  const stub = new ServiceStub('RT-Bot', broker)

  const statusUpdates$ = stub.subscribeToTopic<RawServiceStatus>('status')
  const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
    multicast(() => {
      return new ReplaySubject<ServiceCollectionMap>(1)
    }),
    refCount(),
  )
  const serviceStubWrapper = new ServiceStubWrapper(stub, serviceStatus$)

  const tradeStream$ = serviceStubWrapper
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
    share(),
  )

  return { tradeStream$, priceSubsription$ }
}

export type RTServices = ReturnType<typeof createApplicationServices>
