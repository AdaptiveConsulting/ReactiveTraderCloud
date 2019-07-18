import { config } from 'dotenv';
import { map, mergeMap, scan, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
import AutobahnConnectionProxy, { createConnection$, ServiceStub } from './connection';
import { convertToPrice, Price, RawPrice } from './domain';
import logger from './logger';
import { createPriceMessage } from './messages';
import SymphonClient from './symphony';

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
  logger.error(key)

  throw Error('missing configuration')
}

const symphonyConfig = { subdomain: 'weareadaptive', botUsername, botEmailAddress }

logger.info('Configuring client with', symphonyConfig)

const symphony = new SymphonClient(symphonyConfig, key, false)

const priceToQuery = (prices: Map<string, Price>, text)=>Array.from(prices.keys()).find(pair => text.search(pair) > -1)

const messageEvent$ = symphony.dataEvents$()
  .pipe(
    tap(message=>logger.info(message)),
    withLatestFrom(priceSubsription$),
    mergeMap(([message, latestPrices]) => {
      const matched = priceToQuery(latestPrices,message.messageText)
      const returnMessage = matched ? createPriceMessage(latestPrices.get(matched)!) : `No symbol found for: ${message.messageText}`
      return symphony.sendMessage(message.stream.streamId, returnMessage)
    })
  ).subscribe(message => {
    logger.info('Messaged sent to Syphony', message)
  },
    (error) => {
      logger.error('Error sending to Syphony', error)
    }
  )

process.on('exit', () => {
  messageEvent$.unsubscribe()
})
