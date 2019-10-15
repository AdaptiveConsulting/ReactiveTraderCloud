import { DetectIntentResponse } from 'dialogflow'
import {
  CURRENCY_INTENT,
  MARKET_INFO_INTENT,
  SPOT_QUOTE_INTENT,
  TRADES_INFO_INTENT,
} from './intents'

export const mapIntent = (response: DetectIntentResponse[]) => {
  let result = ''
  switch (response[0].queryResult.intent.displayName) {
    case CURRENCY_INTENT:
    case MARKET_INFO_INTENT:
    case SPOT_QUOTE_INTENT:
    case TRADES_INFO_INTENT:
    default:
      result = [
        response[0].queryResult.intent.displayName,
        response[0].queryResult.fulfillmentText,
      ].join(' => ')
  }

  return result
}
