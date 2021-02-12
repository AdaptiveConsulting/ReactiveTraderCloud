import { createListener, mergeWithKey } from "@react-rxjs/utils"
import {
  concatAll,
  concatMap,
  map,
  scan,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators"
import { QuoteState, rfq$, RfqResponse } from "services/rfqs"
import { getNotional$, tileExecutions$ } from "../Tile.state"
import { symbolBind } from "../Tile.context"

const [rfqButtonClicks$, onRfqButtonClick] = createListener<string>()

export { onRfqButtonClick }

const [rejections$, onRejection] = createListener<string>()

export { onRejection }

interface RfqState {
  quoteState?: QuoteState
  rfqResponse?: RfqResponse
}

const [quoteRequests$, dispatchQuoteRequest] = createListener<string>()

const quoteResponses$ = quoteRequests$.pipe(
  tap((symbol) => {
    console.log("Called: ", symbol)
  }),
  withLatestFrom((symbol) =>
    getNotional$(symbol).pipe(
      take(1),
      map((notional) => [symbol, notional] as const),
    ),
  ),
  concatAll(),
  concatMap(([symbol, notional]) =>
    rfq$({ symbol, notional: parseInt(notional) }),
  ),
)

const rfqTileStateMap$ = mergeWithKey({
  executions: tileExecutions$.pipe(map((e) => ({ symbol: e.symbol }))),
  rfqButtonClicks: rfqButtonClicks$.pipe(map((symbol) => ({ symbol }))),
  rejections: rejections$.pipe(map((symbol) => ({ symbol }))),
  quoteResponses: quoteResponses$.pipe(
    map((response) => ({
      symbol: response.price.symbol,
      quoteResponse: response,
    })),
  ),
}).pipe(
  scan((currentStateMap, { type, payload }) => {
    const { symbol, quoteResponse } = payload as {
      symbol: string
      quoteResponse?: RfqResponse
    }
    const nextQuoteState =
      type === "rfqButtonClicks" &&
      currentStateMap[symbol]?.quoteState !== QuoteState.Requested
        ? QuoteState.Requested
        : type === "quoteResponses"
        ? QuoteState.Received
        : type === "rejections"
        ? QuoteState.Rejected
        : undefined

    if (nextQuoteState === QuoteState.Requested) {
      dispatchQuoteRequest(symbol)
    }

    return {
      ...currentStateMap,
      [symbol]: {
        quoteState: nextQuoteState,
        rfqResponse: quoteResponse || currentStateMap[symbol]?.rfqResponse,
      },
    }
  }, {} as Record<string, RfqState>),
)

const [useRfqState, getRfqState$] = symbolBind(
  (symbol: string) =>
    rfqTileStateMap$.pipe(map((stateMap) => stateMap[symbol])),
  {} as RfqState,
)

export { useRfqState, getRfqState$ }

const [useIsRfq, isRfq$] = symbolBind((symbol: string) =>
  getNotional$(symbol).pipe(
    map((newNotional) => parseFloat(newNotional) >= 10_000_000),
  ),
)

export { useIsRfq, isRfq$ }
