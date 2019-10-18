import { DetectIntentResponse, QueryResult } from 'dialogflow'
import {
  MARKET_INFO_INTENT,
  SPOT_QUOTE_INTENT,
  TRADES_INFO_INTENT,
} from './intents'
import { PlatformAdapter } from 'rt-platforms'
import { showBlotter, showCurrencyPair, showMarket } from './intent-handlers'

export function getCurrencyPair(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.parameters.fields.CurrencyPairs.stringValue
  } catch (e) {
    console.error(`Can't read currency pair`)
    return undefined
  }
}

export function getCurrency(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.parameters.fields.Currency.stringValue
  } catch (e) {
    console.error(`Can't read currency`)
    return undefined
  }
}

export function getNumber(queryResult: QueryResult): number | undefined {
  try {
    return queryResult.parameters.fields.number.numberValue
  } catch (e) {
    console.error(`Can't read number`)
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
    case MARKET_INFO_INTENT:
      showMarket(platformAdapter)
      return
    case TRADES_INFO_INTENT: {
      const currencyPair = getCurrencyPair(queryResult)
      const currency = getCurrency(queryResult)
      showBlotter({ dealtCurrency:[currency], symbol: [currencyPair] }, platformAdapter)
      return
    }
    default:
      console.log(`Do not know how to handle intent ${intentDisplayName}`)
  }
}
