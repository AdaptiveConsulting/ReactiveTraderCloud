import { QueryResult } from 'dialogflow'

export function getCurrencyPair(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.parameters.fields.CurrencyPairs.stringValue
  } catch (e) {
    return undefined
  }
}

export function getCurrency(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.parameters.fields.Currency.stringValue
  } catch (e) {
    return undefined
  }
}

export function getNumber(queryResult: QueryResult): number | undefined {
  try {
    return queryResult.parameters.fields.number.numberValue
  } catch (e) {
    return undefined
  }
}

export function getIntentDisplayName(queryResult: QueryResult): string | undefined {
  try {
    return queryResult.intent.displayName
  } catch (e) {
    return undefined
  }
}
