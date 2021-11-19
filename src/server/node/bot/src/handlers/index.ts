import { SymphonyClient } from 'symphony'
import { NLPServices } from '../services'
import defaultIntentHander from './defaultIntentHandler'
import marketIntentHandler from './marketIntentHandler'
import priceQuoteHandler from './priceQuoteIntentHandler'
import tradeIntentHandler from './tradeIntentHandler'
import tradeNotificationHandler from './tradeNotificationHandler'

type Handler = (symphony: SymphonyClient, nlpServices: NLPServices) => () => void

export {
  Handler,
  defaultIntentHander,
  marketIntentHandler,
  priceQuoteHandler,
  tradeIntentHandler,
  tradeNotificationHandler
}
