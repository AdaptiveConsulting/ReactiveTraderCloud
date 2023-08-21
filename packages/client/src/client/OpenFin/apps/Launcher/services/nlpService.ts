import { protos } from "@google-cloud/dialogflow"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { equals } from "client/utils"
import { Direction } from "generated/TradingGateway"
import {
  catchError,
  concat,
  distinctUntilChanged,
  map,
  merge,
  of,
  switchMap,
  timer,
} from "rxjs"
import { fromFetch } from "rxjs/fetch"

const [input$, setInput] = createSignal<string>()
export { setInput }

const [resetInput$, onResetInput] = createSignal()
export { onResetInput }

const [useNlpInput, nlpInput$] = bind(
  merge(input$, resetInput$.pipe(map(() => ""))),
  "",
)
export { useNlpInput }

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
    count: number
    symbol: string
    currency: string
  }
}

export interface MarketInfoIntent {
  type: NlpIntentType.MarketInfo
  payload: Record<string, unknown>
}

export interface CreditRfqIntent {
  type: NlpIntentType.CreditRfq
  payload: {
    rfqIntent: string
    symbol: string
    direction: Direction
    notional: number
    maturity: string
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

export const [useNlpIntent, nlpIntent$] = bind<NlpIntent | Loading | null>(
  nlpInput$.pipe(
    switchMap((request) =>
      request.length === 0
        ? [null]
        : concat(
            timer(250).pipe(map(() => "loading" as Loading)),
            fromFetch(
              `${import.meta.env.VITE_CLOUD_FUNCTION_HOST}/nlp?term=${request}`,
            ).pipe(
              switchMap((response) => response.json()),
              map<
                protos.google.cloud.dialogflow.v2.DetectIntentResponse[],
                protos.google.cloud.dialogflow.v2.DetectIntentResponse
              >(([response]) => response),
              catchError((e) => {
                console.error("Error getting nlp response", e)
                return of(null)
              }),
            ),
          ),
    ),
    map((response) => {
      if (response === "loading") return "loading"
      if (!response || !response.queryResult?.intent?.displayName) return null

      const intent = intentMapper[response.queryResult?.intent?.displayName]
      const intentFields = response.queryResult?.parameters?.fields

      const symbol =
        intentFields?.CurrencyPairs?.stringValue ||
        intentFields?.Bond?.stringValue

      const direction = intentFields?.TradeType?.stringValue

      const value = intentFields?.number?.numberValue

      const maturity = intentFields?.Maturity?.stringValue

      const rfqIntent = intentFields?.CreditRfq?.stringValue

      switch (intent) {
        case NlpIntentType.TradeExecution: {
          return direction
            ? ({
                type: NlpIntentType.TradeExecution,
                payload: {
                  symbol,
                  direction: directionMapper[direction],
                  notional: value,
                },
              } as TradeExecutionIntent)
            : null
        }

        case NlpIntentType.CreditRfq: {
          if (direction || rfqIntent) {
            return {
              type: NlpIntentType.CreditRfq,
              payload: {
                rfqIntent,
                symbol,
                direction: directionMapper[direction ?? ""],
                notional: value,
                maturity: maturity,
              },
            } as CreditRfqIntent
          } else {
            return null
          }
        }

        case NlpIntentType.MarketInfo:
          return {
            type: NlpIntentType.MarketInfo,
            payload: {},
          } as MarketInfoIntent

        case NlpIntentType.TradeInfo:
          return {
            type: NlpIntentType.TradeInfo,
            payload: {
              symbol,
              count: value,
              currency:
                response.queryResult?.parameters?.fields?.Currency?.stringValue,
            },
          } as TradesInfoIntent

        case NlpIntentType.SpotQuote:
          return symbol
            ? ({
                type: NlpIntentType.SpotQuote,
                payload: {
                  symbol,
                },
              } as SpotQuoteIntent)
            : null

        default:
          return null
      }
    }),
    distinctUntilChanged(equals),
  ),
  null,
)

export const [useIsNlpIntentLoading] = bind(
  nlpIntent$.pipe(map((intent) => intent === "loading")),
  false,
)
