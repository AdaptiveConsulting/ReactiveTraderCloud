import { DetectIntentResponse } from 'dialogflow'

const CURRENCY_INTENT = 'rt.currency.info'
const MARKET_INFO_INTENT = 'rt.market.info'
const SPOT_QUOTE_INTENT = 'rt.spot.quote'
const TRADES_INFO_INTENT = 'rt.trades.info'

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
        response[0].queryResult.fulfillmentText
      ].join(' => ')
  }


  return result
}
