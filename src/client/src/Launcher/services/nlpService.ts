import { Direction } from "@/services/trades"
import { DetectIntentResponse } from "dialogflow"
import { ajax, AjaxResponse } from "rxjs/ajax"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  catchError,
  distinctUntilChanged,
  map,
  mapTo,
  pluck,
  switchMap,
} from "rxjs/operators"
import { equals } from "@/utils"
import { concat, merge, of, timer } from "rxjs"

const [input$, setInput] = createSignal<string>()
export { setInput }

const [resetInput$, onResetInput] = createSignal()
export { onResetInput }

const [useNlpInput, nlpInput$] = bind(
  merge(input$, resetInput$.pipe(mapTo(""))),
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
  payload: {}
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

export const [useNlpIntent, nlpIntent$] = bind<NlpIntent | null | Loading>(
  nlpInput$.pipe(
    switchMap((request) =>
      request.length === 0
        ? [null]
        : concat(
            timer(250).pipe(mapTo("loading" as Loading)),
            ajax(
              `${import.meta.env.VITE_CLOUD_FUNCTION_HOST}/nlp?term=${request}`,
            ).pipe(
              map<AjaxResponse, DetectIntentResponse[]>(
                ({ response }) => response,
              ),
              pluck(0),
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
      const number =
        response.queryResult?.parameters?.fields?.number?.numberValue

      switch (intent) {
        case NlpIntentType.TradeExecution: {
          const result = {
            type: NlpIntentType.TradeExecution,
            payload: {
              symbol,
              direction:
                directionMapper[
                  response.queryResult.parameters.fields.TradeType.stringValue
                ],
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

        default:
          return null
      }
    }),
    distinctUntilChanged(equals) as any,
  ),
  null,
)

export const [useIsNlpIntentLoading] = bind(
  nlpIntent$.pipe(map((intent) => intent === "loading")),
  false,
)
