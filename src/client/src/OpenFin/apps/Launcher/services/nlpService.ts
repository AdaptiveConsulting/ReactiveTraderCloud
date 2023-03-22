import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { DetectIntentResponse } from "dialogflow"
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

import { Direction } from "@/generated/TradingGateway"
import { equals } from "@/utils"

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
}

export interface TradeExecutionIntent {
  type: NlpIntentType.TradeExecution
  payload: {
    symbol?: string
    direction?: Direction
    notional?: number
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
  payload: Record<string, unknown>
}

export type NlpIntent =
  | TradeExecutionIntent
  | SpotQuoteIntent
  | TradesInfoIntent
  | MarketInfoIntent

const intentMapper: Record<string, NlpIntentType> = {
  "rt.trades.execute": NlpIntentType.TradeExecution,
  "rt.spot.quote": NlpIntentType.SpotQuote,
  "rt.trades.info": NlpIntentType.TradeInfo,
  "rt.market.info": NlpIntentType.MarketInfo,
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
              map<DetectIntentResponse[], DetectIntentResponse>(
                ([response]) => response,
              ),
              catchError((e) => {
                console.error("Error getting nlp response", e)
                return of(null)
              }),
            ),
          ),
    ),
    map((response) => {
      if (response === "loading") return "loading"
      if (!response) return null

      const intent = intentMapper[response.queryResult?.intent?.displayName]
      const symbol =
        response.queryResult?.parameters?.fields?.CurrencyPairs?.stringValue
      const value: number =
        response.queryResult?.parameters?.fields?.number?.numberValue

      switch (intent) {
        case NlpIntentType.TradeExecution: {
          return {
            type: NlpIntentType.TradeExecution,
            payload: {
              symbol,
              direction:
                directionMapper[
                  response.queryResult.parameters.fields.TradeType.stringValue
                ],
              notional: value,
            },
          } as TradeExecutionIntent
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
