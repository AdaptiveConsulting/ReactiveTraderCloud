import { DetectIntentResponse } from 'dialogflow'
import { MARKET_INFO_INTENT, SPOT_QUOTE_INTENT, TRADES_INFO_INTENT, } from './intents'

export const mapIntent = (response: DetectIntentResponse): string => {
  let result = ''
  if (!response) {
    return result
  }

  switch (response.queryResult.intent.displayName) {
    case SPOT_QUOTE_INTENT:
      const currencyPair = response.queryResult.parameters.fields.CurrencyPairs.stringValue
      result = `Open ${currencyPair}`
      break
    case MARKET_INFO_INTENT:
      return `Open market view`
    case TRADES_INFO_INTENT:
      return `Open blotter`
    default:
      result = [
        response.queryResult.intent.displayName,
        response.queryResult.fulfillmentText,
      ].join(' => ')
  }

  return result
}

export const isSpotQuoteIntent = (response: DetectIntentResponse) => {
  return response && response.queryResult.intent.displayName === SPOT_QUOTE_INTENT
}

export const isTradeIntent = (response: DetectIntentResponse) => {
  return response && response.queryResult.intent.displayName === TRADES_INFO_INTENT
}
