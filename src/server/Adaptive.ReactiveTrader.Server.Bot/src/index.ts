import { config } from 'dotenv';
import { from, NextObserver, ReplaySubject } from 'rxjs';
import { filter, map, mergeMap, multicast, refCount, scan, share, shareReplay, withLatestFrom } from 'rxjs/operators';
import AutobahnConnectionProxy, { createConnection$, ServiceStub } from './connection';
import { ServiceCollectionMap } from './connection/ServiceInstanceCollection';
import { serviceStatusStream$ } from './connection/serviceStatusStream';
import ServiceStubWithLoadBalancer from './connection/ServiceStubWithLoadBalancer';
import { convertToPrice, Price, RawPrice, RawServiceStatus, Trade, TradeUpdate } from './domain';
import logger from './logger';
import { createPriceMessage, marketUpdateMessage, tradeNotificationMessage, tradeUpdateMessage } from './messages';
import { SymphonyClient } from './symphony';
const HEARTBEAT_TIMEOUT = 3000

config()

logger.info('Starting RT BOT')

/* 
Setup reactive trader streams
*/

const host = process.env.BROKER_HOST || 'broker'
const realm = process.env.WAMP_REALM || 'com.weareadaptive.reactivetrader'
const port = process.env.BROKER_PORT || 8000

logger.info(`Started bot-service for ${host}:${port} on realm ${realm}`)

const autobahn = new AutobahnConnectionProxy(host, realm!, +port!)
const connection$ = createConnection$(autobahn).pipe(shareReplay(1))
const stub = new ServiceStub('RT-Bot', connection$)



const priceSubsription$ = stub
  .subscribeToTopic<RawPrice>('prices')
  .pipe(
    map(price => convertToPrice(price)),
    scan<Price, Map<string, Price>>((acc, price) =>
      acc.set(price.symbol, price),
      new Map<string, Price>())
  )

/* 
Setup symphony streams
*/
const key = process.env.PRIVATE_KEY || '';

const botUsername = process.env.BOT_NAME
const botEmailAddress = process.env.BOT_ADDRESS

if (!key || !botUsername || !botEmailAddress) {
  throw Error('missing configuration')
}

const symphonyConfig = { subdomain: 'weareadaptive', botUsername, botEmailAddress }

logger.info('Configuring client with', symphonyConfig)

const symphony = new SymphonyClient(symphonyConfig, key, false)

const priceToQuery = (prices: Map<string, Price>, text) => Array.from(prices.keys()).find(pair => text.search(pair) > -1)

const logSubscriber: NextObserver<any> = {
  next: message => logger.info('Messaged succesfully sent to Syphony'),
  error: (error) => logger.error('Error sending to Syphony', error)
}

const messageEvent$ = symphony.dataEvents$().pipe(share())

const priceSubscriber$ = messageEvent$.pipe(
  filter(message => message.messageText.includes('price')),
  withLatestFrom(priceSubsription$),
  mergeMap(([message, latestPrices]) => {
    const matched = priceToQuery(latestPrices, message.messageText)
    const messageMarkup = matched ? createPriceMessage(latestPrices.get(matched)!) : `No symbol found for: ${message.messageText}`
    return symphony.sendMessage(message.stream.streamId, messageMarkup)
  })
).subscribe(logSubscriber)

const marketSubscriber$ = messageEvent$.pipe(
  filter(message => message.messageText.includes('market')),
  withLatestFrom(priceSubsription$),
  mergeMap(([message, latestPrices]) => {
    const messageMarkup = marketUpdateMessage(Array.from(latestPrices.values()))
    return symphony.sendMessage(message.stream.streamId, messageMarkup)
  })
).subscribe(logSubscriber)

const statusUpdates$ = stub.subscribeToTopic<RawServiceStatus>('status')
const serviceStatus$ = serviceStatusStream$(statusUpdates$, HEARTBEAT_TIMEOUT).pipe(
  multicast(() => {
    return new ReplaySubject<ServiceCollectionMap>(1)
  }),
  refCount(),
)

const loadBalancedServiceStub = new ServiceStubWithLoadBalancer(stub, serviceStatus$)

const tradeStream$ = loadBalancedServiceStub.createStreamOperation<TradeUpdate>('blotter', 'getTradesStream', {}).pipe(share());

const latestTrades$ = tradeStream$
  .pipe(
    map(tradeUpdate => tradeUpdate.Trades),

    scan<Trade[], Map<number, Trade>>((acc, trades) => {
      trades.forEach(trade => acc.set(trade.TradeId, trade))
      return acc
    },
      new Map<number, Trade>()),
    map(trades => Array.from(trades.values())),
    share()
  )


const trade$ = messageEvent$.pipe(
  filter(message => message.messageText.includes('trades')),
  withLatestFrom(latestTrades$),
  mergeMap(([message, trades]) => {
    return symphony.sendMessage(message.stream.streamId, tradeUpdateMessage(trades))
  })
).subscribe(logSubscriber)

const tradeUpdates$ = messageEvent$.pipe(
  filter(message => message.messageText.includes('trade updates')),
  mergeMap(message => {
    return tradeStream$.pipe(
      filter(update => !update.IsStateOfTheWorld),
      mergeMap(tradeUpdate => from(tradeUpdate.Trades)),
      mergeMap(trade => symphony.sendMessage(message.stream.streamId, tradeNotificationMessage(trade)))
    )
  })).subscribe(logSubscriber)


process.on('exit', () => {
  priceSubscriber$.unsubscribe()
  marketSubscriber$.unsubscribe()
  trade$.unsubscribe()
  tradeUpdates$.unsubscribe()
})
