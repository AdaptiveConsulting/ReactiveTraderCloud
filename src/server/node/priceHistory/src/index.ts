import { map, scan } from 'rxjs/operators'
import uuid from 'uuid/v1'
import { WsConnectionProxy, connectionStream$, ServiceStub, logger } from 'shared'
import { convertToPrice, Price, RawPrice } from './domain'
import { RawServiceStatus } from './domain'

const host = process.env.BROKER_HOST || 'localhost'
const port = process.env.BROKER_PORT || 15674

logger.info(`Started priceHistory service for ${host}:${port}`)

const broker = new WsConnectionProxy(host, +port)
const stub = new ServiceStub('BHA', broker)

const HISTORY_LENGTH = 1000

const HOST_TYPE = 'priceHistory'
const hostInstance = `${HOST_TYPE}.${uuid().substring(0, 4)}`

const savePrices = scan<Price, Map<string, Price[]>>((acc, price) => {
  if (!acc.has(price.symbol)) {
    acc.set(price.symbol, [])
  }

  const history = acc.get(price.symbol)
  if (history) {
    if (history.length >= HISTORY_LENGTH) {
      history.shift()
    }
    history.push(price)
  }
  return acc
}, new Map())

function publishStatus(): void {
  const status: RawServiceStatus = {
    Type: 'priceHistory',
    Load: 1,
    TimeStamp: Date.now(),
    Instance: hostInstance,
  }
  broker.streamEndpoint.publish({ destination: '/exchange/status', body: JSON.stringify(status) })
}

connectionStream$(broker).subscribe(state => {
  console.debug(`Broker connection state: ${state}`)
  publishStatus()
})
logger.info(`Starting heart beat with ${HOST_TYPE} and ${hostInstance}`)

logger.info('Subscribing to Pricing')

let latest: ReadonlyMap<string, Price[]>

const heartbeat$ = stub
  .subscribeToTopic<RawPrice>('prices')
  .pipe(
    map(price => convertToPrice(price)),
    savePrices,
  )
  .subscribe(newPrices => {
    latest = newPrices
    publishStatus()
  })

logger.info(`Starting listening to price requests`)

type PriceHistoryRequest = { payload: string }

function handlePriceRequest(priceHistoryRequest: PriceHistoryRequest): Price[] | undefined {
  if (!priceHistoryRequest || !priceHistoryRequest.payload) {
    throw new Error(`Invalid request`)
  }
  const symbol = priceHistoryRequest.payload
  if (!latest.has(symbol)) {
    throw Error(`The currency pair requested was not recognised: ${symbol}`)
  }
  logger.info(`Request received ${symbol}`)

  return latest.get(symbol)
}

const priceRequestsSubsription$ = stub.replyToRequestResponseOperation(
  'priceHistory',
  'getPriceHistory',
  handlePriceRequest,
)

process.on('exit', () => {
  heartbeat$.unsubscribe()
  priceRequestsSubsription$.unsubscribe()
})
