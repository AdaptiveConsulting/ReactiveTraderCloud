import dotEnv from 'dotenv'
import { interval, NextObserver } from 'rxjs'
import { filter, map, mapTo, shareReplay, switchMap, scan } from 'rxjs/operators'
import uuid from 'uuid/v1'
import AutobahnConnectionProxy from './AutobahnConnectionProxy'
import { ConnectionEventType, ConnectionOpenEvent, createConnection$ } from './connectionStream'
import { RawPrice } from './domain'
import { RawServiceStatus } from './domain'
import { ServiceStub } from './ServiceStub'

if (process.env.NODE_ENV !== 'production') {
  dotEnv.load()
}

const HOST_TYPE = 'priceHistory'
const hostInstance = `${HOST_TYPE}.${uuid().substring(0, 4)}`

const autobahn = new AutobahnConnectionProxy(
  process.env.BROKER_HOST!,
  process.env.WAMP_REALM!,
  +process.env.BROKER_PORT!,
)

const connection$ = createConnection$(autobahn).pipe(shareReplay(1))

const stub = new ServiceStub('BHA', connection$)

const HISTORY_LENGTH = 10000

console.info('Subscribing to Pricing')

let latest: ReadonlyMap<string, RawPrice[]>

const savePrices = scan<RawPrice, Map<string, RawPrice[]>>((acc, price) => {
  if (!acc.has(price.Symbol)) {
    acc.set(price.Symbol, [])
  }

  const history = acc.get(price.Symbol)!
  if (history.length >= HISTORY_LENGTH) {
    history.shift()
  }

  history.push(price)
  return acc
}, new Map())

const priceSubsription$ = stub
  .subscribeToTopic<RawPrice>('prices')
  .pipe(savePrices)
  .subscribe(newPrices => {
    latest = newPrices
  })

const session$ = connection$.pipe(
  filter((connection): connection is ConnectionOpenEvent => connection.type === ConnectionEventType.CONNECTED),
  map(connection => connection.session),
)

console.info('Starting heart beat')

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
  console.info('Connection Established')
  console.info('Registering getPriceHistory')

  session.register('getPriceHistory', (request: PriceHistoryRequest) => {
    console.info('Request recieved')

    if (!request || !request[0] || !request[0].payload) {
      throw new Error(`The request for price history was malformed: ${request}`)
    }
    const symbol = request[0].payload

    if (latest.has(symbol)) {
      throw Error(`The currency pair requested was not recognised: ${symbol}`)
    }
    return latest.get(symbol)
  })
})

process.on('exit', () => {
  heartbeat$.unsubscribe()
  priceSubsription$.unsubscribe()
})
