import { DetectIntentResponse, QueryResult } from 'dialogflow'
import {
  CURRENCY_INTENT,
  MARKET_INFO_INTENT,
  SPOT_QUOTE_INTENT,
  TRADES_INFO_INTENT,
} from './intents'
import { PlatformAdapter } from 'rt-platforms'
import { showBlotter, showCurrencyPair } from './intent-handlers'

function getCurrencyPair(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.parameters.fields.CurrencyPairs.stringValue
  } catch (e) {
    console.error(`Can't read currency pair`)
    return undefined
  }
}

function getCurrency(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.parameters.fields.Currency.stringValue
  } catch (e) {
    console.error(`Can't read currency`)
    return undefined
  }
}

function getIntentDisplayName(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.intent.displayName
  } catch (e) {
    console.error(`Can't read intent display name`)
    return
  }
}

function getQueryResult(response: DetectIntentResponse): QueryResult {
  try {
    return response.queryResult
  } catch (e) {
    console.error(`Can't read queryResult`)
    return
  }
}

export const handleIntent = (response: DetectIntentResponse, platformAdapter: PlatformAdapter) => {
  const queryResult = getQueryResult(response)
  const intentDisplayName = getIntentDisplayName(queryResult)
  switch (intentDisplayName) {
    case SPOT_QUOTE_INTENT: {
      const currencyPair = getCurrencyPair(queryResult)
      if (!currencyPair) {
        console.error(`No currency pair in queryResult`)
        return
      }
      showCurrencyPair(currencyPair, platformAdapter)
      return
    }
    case CURRENCY_INTENT:
    case MARKET_INFO_INTENT:
    case TRADES_INFO_INTENT: {
      const currencyPair = getCurrencyPair(queryResult)
      const currency = getCurrency(queryResult)
      if (!currencyPair || !currency) {
        console.error(`No currency pair or currency in queryResult`)
        return
      }
      showBlotter({ currencyPair, currency }, platformAdapter)
      return
    }
    default:
      console.log(`Do not know how to handle intent ${intentDisplayName}`)
  }
}
