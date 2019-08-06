import { config } from 'dotenv';
import { defaultIntentHander } from './handlers/defaultIntentHandler';
import { Handler } from './handlers/handlers';
import { marketMessageHandler } from './handlers/marketIntentHandler';
import { priceQuoteHandler } from './handlers/priceQuoteIntentHandler';
import { tradeMessageHandler } from './handlers/tradeIntentHandler';
import logger from './logger';
import { createNlpStream } from './nlp-services';
import { createApplicationServices } from './rt-services';
import { SymphonyClient } from './symphony';

config()

const host = process.env.BROKER_HOST || 'broker'
const realm = process.env.WAMP_REALM || 'com.weareadaptive.reactivetrader'
const port = process.env.BROKER_PORT || `8000`

const services = createApplicationServices(host, realm, port)

/* 
Setup symphony streams
*/

const key = process.env.PRIVATE_KEY || '';

const botUsername = process.env.BOT_NAME
const botEmailAddress = process.env.BOT_ADDRESS

if (!key || !botUsername || !botEmailAddress) {
  if (!key) {
    logger.info('no key in env variables')
  }

  if (!botUsername) {
    logger.info('no key in env variables')
  }

  if (!botEmailAddress) {
    logger.info('no key in env variables')
  }

  throw Error('missing configuration')
}

const symphonyConfig = { subdomain: 'weareadaptive', botUsername, botEmailAddress }

logger.info('Configuring client with', symphonyConfig)

const symphony = new SymphonyClient(symphonyConfig, key, false)

const nlp$ = createNlpStream(symphony)

const registerIntentHandlers = (handlers: Handler[]) => {
  return handlers.map(handler => handler.call(null, symphony, nlp$, services))
}

const disposables = registerIntentHandlers([tradeMessageHandler, marketMessageHandler, priceQuoteHandler, defaultIntentHander])

process.on('exit', () => {
  disposables.forEach((subscription) => subscription())
})
