import { interval, NextObserver } from 'rxjs'
import { filter, map, mapTo, scan, shareReplay, switchMap } from 'rxjs/operators'
import uuid from 'uuid/v1'
import AutobahnConnectionProxy from './connection'
import { ConnectionEventType, ConnectionOpenEvent, createConnection$ } from './connection'
import { ServiceStub } from './connection'
import { convertToPrice, Price, RawPrice } from './domain'
import { RawServiceStatus } from './domain'
import logger from './logger'

const host = process.env.BROKER_HOST || 'broker'
const realm = process.env.WAMP_REALM || 'com.weareadaptive.reactivetrader'
const port = process.env.BROKER_PORT || 8000

logger.info(`Started priceHistory service for ${host}:${port} on realm ${realm}`)

const autobahn = new AutobahnConnectionProxy(host, realm!, +port!)

const connection$ = createConnection$(autobahn).pipe(shareReplay(1))

const stub = new ServiceStub('BHA', connection$)

const HISTORY_LENGTH = 1000

logger.info('Subscribing to Pricing')

let latest: ReadonlyMap<string, Price[]>

const savePrices = scan<Price, Map<string, Price[]>>((acc, price) => {
  if (!acc.has(price.symbol)) {
    acc.set(price.symbol, [])
  }

  const history = acc.get(price.symbol)!
  if (history.length >= HISTORY_LENGTH) {
    history.shift()
  }

  history.push(price)
  return acc
}, new Map())

const priceSubsription$ = stub
  .subscribeToTopic<RawPrice>('prices')
  .pipe(
    map(price=>convertToPrice(price)),
    savePrices)
  .subscribe(newPrices => {
    latest = newPrices
  })

const session$ = connection$.pipe(
  filter((connection): connection is ConnectionOpenEvent => connection.type === ConnectionEventType.CONNECTED),
  map(connection => connection.session),
)

const HOST_TYPE = 'priceHistory'
const hostInstance = `${HOST_TYPE}.${uuid().substring(0, 4)}`

logger.info(`Starting heart beat with ${HOST_TYPE} and ${hostInstance}`)

const heartbeat$ = session$.pipe(switchMap(session => interval(1000).pipe(mapTo(session)))).subscribe(session => {
  const status: RawServiceStatus = {
    Type: 'priceHistory',
    Load: 1,
    TimeStamp: Date.now(),
    Instance: hostInstance,
  }
  session.publish('status', [status])
})

type PriceHistoryRequest = [{ payload: string }]

session$.subscribe(session => {
  logger.info('Connection Established')
  const registration = `${hostInstance}.getPriceHistory`
  logger.info(`Registering ${registration}`)


  logger.info('Connection Established')

  session.register(registration, (request: PriceHistoryRequest) => {

    if (!request || !request[0] || !request[0].payload) {
      throw new Error(`The request for price history was malformed: ${request}`)
    }
    const symbol = request[0].payload

    if (!latest.has(symbol)) {
      throw Error(`The currency pair requested was not recognised: ${symbol}`)
    }
    logger.info(`Request recieved ${symbol}`)


    return latest.get(symbol)
  })
})

process.on('exit', () => {
  heartbeat$.unsubscribe()
  priceSubsription$.unsubscribe()
})
