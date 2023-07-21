/* eslint-disable @typescript-eslint/ban-ts-comment */
import { protos } from "@google-cloud/dialogflow"

export enum Direction {
  Buy = "Buy",
  Sell = "Sell",
}

export enum NlpIntentType {
  TradeExecution,
  SpotQuote,
  TradeInfo,
  MarketInfo,
  CreditRfq,
}

export interface TradeExecutionIntent {
  type: NlpIntentType.TradeExecution
  payload: {
    symbol: string
    direction: Direction
    notional: number
  }
}

export interface SpotQuoteIntent {
  type: NlpIntentType.SpotQuote
  payload: {
    symbol: string
  }
}

export interface TradesInfoIntent {
  type: NlpIntentType.TradeInfo
  payload: {
    count?: number
    symbol?: string
    currency?: string
  }
}

export interface MarketInfoIntent {
  type: NlpIntentType.MarketInfo
  // eslint-disable-next-line @typescript-eslint/ban-types
  payload: {}
}

export interface CreditRfqIntent {
  type: NlpIntentType.CreditRfq
  payload: {
    symbol: string
    direction: Direction
    notional: number
  }
}

export type NlpIntent =
  | TradeExecutionIntent
  | SpotQuoteIntent
  | TradesInfoIntent
  | MarketInfoIntent
  | CreditRfqIntent

const intentMapper: Record<string, NlpIntentType> = {
  "rt.trades.execute": NlpIntentType.TradeExecution,
  "rt.spot.quote": NlpIntentType.SpotQuote,
  "rt.trades.info": NlpIntentType.TradeInfo,
  "rt.market.info": NlpIntentType.MarketInfo,
  "rt.credit.rfq": NlpIntentType.CreditRfq,
}

const directionMapper: Record<string, Direction> = {
  buy: Direction.Buy,
  sell: Direction.Sell,
}

export type Loading = "loading"

export const getNlpIntent = async (query: string) => {
  const [response] = (await fetch(
    `${import.meta.env.VITE_CLOUD_FUNCTION_HOST}/nlp?term=${query}`,
  ).then((r) =>
    r.json(),
  )) as protos.google.cloud.dialogflow.v2.DetectIntentResponse[]

  if (response === null) return null

  // @ts-ignore
  const intent = intentMapper[response.queryResult?.intent?.displayName]
  // @ts-ignore
  const symbol =
    intent === NlpIntentType.CreditRfq
      ? response.queryResult?.parameters?.fields?.Bond?.stringValue
      : response.queryResult?.parameters?.fields?.CurrencyPairs?.stringValue
  // @ts-ignore
  const number = response.queryResult?.parameters?.fields?.number
    ?.numberValue as number

  const direction =
    directionMapper[
      // @ts-ignore
      response.queryResult.parameters.fields.TradeType.stringValue
    ]

  switch (intent) {
    case NlpIntentType.TradeExecution: {
      const result = {
        type: NlpIntentType.TradeExecution,
        payload: {
          symbol,
          direction,
          notional: number,
        },
      }
      return result
    }

    case NlpIntentType.MarketInfo:
      return {
        type: NlpIntentType.MarketInfo,
        payload: {},
      }

    case NlpIntentType.TradeInfo:
      return {
        type: NlpIntentType.TradeInfo,
        payload: {
          symbol,
          count: number,
          // @ts-ignore
          currency:
            response.queryResult?.parameters?.fields?.Currency?.stringValue,
        },
      }

    case NlpIntentType.SpotQuote:
      return symbol
        ? {
            type: NlpIntentType.SpotQuote,
            payload: {
              symbol,
            },
          }
        : null

    case NlpIntentType.CreditRfq:
      return {
        type: NlpIntentType.CreditRfq,
        payload: {
          symbol,
          direction,
          notional: number,
        },
      }
    default:
      return null
  }
}
