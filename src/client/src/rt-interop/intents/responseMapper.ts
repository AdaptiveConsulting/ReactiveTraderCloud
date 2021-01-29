import { DetectIntentResponse } from 'dialogflow'
import {
  MARKET_INFO_INTENT,
  SPOT_QUOTE_INTENT,
  TRADES_INFO_INTENT,
  TRADES_EXECUTE_INTENT,
} from './intents'

export const mapIntent = (response: DetectIntentResponse): string => {
  let result = ''

  if (!response) {
    return result
  }

  switch (response.queryResult.intent.displayName) {
    case SPOT_QUOTE_INTENT:
      const currencyPair = response.queryResult.parameters.fields.CurrencyPairs.stringValue
      result = `Open ${currencyPair} Tile`
      break
    case MARKET_INFO_INTENT:
      return `Open Live Rates`
    case TRADES_INFO_INTENT:
      return `Open Trades`

    default:
  }

  return result
}

export const isSpotQuoteIntent = (response: DetectIntentResponse) => {
  return response && response.queryResult.intent.displayName === SPOT_QUOTE_INTENT
}

export const isTradeIntent = (response: DetectIntentResponse) => {
  return response && response.queryResult.intent.displayName === TRADES_INFO_INTENT
}

export const isMarketIntent = (response: DetectIntentResponse) => {
  return response && response.queryResult.intent.displayName === MARKET_INFO_INTENT
}

export const isTradeExecutionIntent = (response: DetectIntentResponse) => {
  return response && response.queryResult.intent.displayName === TRADES_EXECUTE_INTENT
}
