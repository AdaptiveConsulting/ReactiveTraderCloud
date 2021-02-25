import { merge } from "rxjs"
import {
  concatAll,
  concatMap,
  map,
  scan,
  take,
  withLatestFrom,
} from "rxjs/operators"
import { createListener, mergeWithKey } from "@react-rxjs/utils"
import { QuoteState, rfq$, RfqResponse } from "services/rfqs"
import { getNotional$, tileExecutions$ } from "../Tile.state"
import { symbolBind } from "../Tile.context"
import { notionalResets$ } from "./NotionalReset"

const [rfqButtonClicks$, onRfqButtonClick] = createListener<string>()

export { onRfqButtonClick }

const [rejections$, onRejection] = createListener<string>()

export { onRejection }

interface RfqState {
  quoteState?: QuoteState
  rfqResponse?: RfqResponse
}

const [quoteRequests$, dispatchQuoteRequest] = createListener<string>()

const [notionalDrops$, onNotionalDrop] = createListener<string>()

const quoteResponses$ = quoteRequests$.pipe(
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

const quoteStateResets$ = merge(
  tileExecutions$.pipe(map((e) => ({ symbol: e.symbol }))),
  notionalResets$.pipe(map((symbol) => ({ symbol }))),
  notionalDrops$.pipe(map((symbol) => ({ symbol }))),
)

const rfqTileStateMap$ = mergeWithKey({
  resets: quoteStateResets$,
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
    scan((lastIsRfq, newNotional) => {
      const nextIsRfq = parseFloat(newNotional) >= 10_000_000
      if (!nextIsRfq && lastIsRfq) {
        onNotionalDrop(symbol)
      }
      return nextIsRfq
    }, false),
  ),
)

export { useIsRfq, isRfq$ }
