import { ExecuteTradeRequest } from 'apps/MainRoute/widgets/spotTile/model'
import { QueryResult } from 'dialogflow'
import { Direction } from 'rt-types'

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

export function getTradeRequest(
  queryResult: QueryResult
): Partial<ExecuteTradeRequest> | undefined {
  if (!queryResult) {
    return
  }
  try {
    const currencyPair = queryResult.parameters.fields.CurrencyPairs.stringValue
    const direction =
      queryResult.parameters.fields.TradeType.stringValue === 'buy' ? Direction.Buy : Direction.Sell
    const notional = queryResult.parameters.fields.number.numberValue

    if (!currencyPair || !direction || !notional) {
      return
    }

    return {
      CurrencyPair: currencyPair,
      Direction: direction,
      Notional: notional,
    }
  } catch (e) {
    return
  }
}
