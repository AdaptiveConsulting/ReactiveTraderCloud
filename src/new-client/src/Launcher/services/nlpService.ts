import { Direction } from "@/services/trades"
import { DetectIntentResponse } from "dialogflow"
import { getRemoteProcedureCall$ } from "../services/client"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  debounceTime,
  distinctUntilChanged,
  map,
  skip,
  startWith,
  switchMap,
} from "rxjs/operators"
import { equals } from "@/utils"

const [input$, setInput] = createSignal<string>()
export { setInput }

const [useNlpInput, nlpInput$] = bind(input$, "")
export { useNlpInput }

export enum NlpIntentType {
  TradeExecution,
  SpotQuote,
  TradeInfo,
  MarketInfo,
}

interface TradeExecutionIntent {
  type: NlpIntentType.TradeExecution
  payload: {
    symbol?: string
    direction?: Direction
    notional?: number
  }
}

interface SpotQuoteIntent {
  type: NlpIntentType.SpotQuote
  payload: {
    symbol: string
  }
}

interface TradesInfoIntent {
  type: NlpIntentType.TradeInfo
  payload: {
    count?: number
    symbol?: string
    currency?: string
  }
}

interface MarketInfoIntent {
  type: NlpIntentType.MarketInfo
  payload: {}
}

type NlpIntent =
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

const [useNlpIntent, nlpIntent$] = bind<NlpIntent | null | Loading>(
  nlpInput$.pipe(
    skip(1),
    debounceTime(250),
    switchMap((request) =>
      getRemoteProcedureCall$<[DetectIntentResponse], string>(
        "nlp",
        "getNlpIntent",
        request,
      ).pipe(startWith(["loading"] as [Loading])),
    ),
    map(([response]) => {
      if (response === "loading") return "loading"
      if (!response) return null

      const intent = intentMapper[response.queryResult?.intent?.displayName]
      const symbol =
        response.queryResult?.parameters?.fields?.CurrencyPairs?.stringValue
      const number =
        response.queryResult?.parameters?.fields?.number?.numberValue

      switch (intent) {
        case NlpIntentType.TradeExecution:
          return {
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

export { useNlpIntent }

export const [useIsNlpIntentLoading] = bind(
  nlpIntent$.pipe(map((intent) => intent === "loading")),
  false,
)
