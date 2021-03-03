import { merge } from "rxjs"
import {
  filter,
  map,
  mergeMap,
  scan,
  take,
  takeUntil,
  tap,
} from "rxjs/operators"
import {
  collect,
  createListener,
  getGroupedObservable,
  mergeWithKey,
  split,
} from "@react-rxjs/utils"
import type { RfqResponse } from "services/rfqs"
import { rfq$ } from "services/rfqs"
import { getNotional$, tileExecutions$ } from "../Tile.state"
import { symbolBind } from "../Tile.context"

export enum QuoteState {
  Init = "Init",
  Requested = "Requested",
  Received = "Received",
  Rejected = "Rejected",
}
interface RfqState {
  quoteState: QuoteState
  rfqResponse?: RfqResponse
}

const [rejections$, onRejection] = createListener<string>()
const [rfqThresholdDrops$, onRfqThresholdDrop] = createListener<string>()
const [requestCancellations$, onCancelRequest] = createListener<string>()
const [quoteRequestClicks$, onQuoteRequest] = createListener<string>()
export { onRejection, onCancelRequest, onQuoteRequest }

const [quoteRequests$, dispatchQuoteRequest] = createListener<string>()
const quoteResponses$ = quoteRequests$.pipe(
  mergeMap((symbol) =>
    getNotional$(symbol).pipe(
      take(1),
      mergeMap((notional) => rfq$({ symbol, notional: parseInt(notional) })),
      takeUntil(requestCancellations$.pipe(filter((key) => key === symbol))),
    ),
  ),
)

export const resets$ = merge(
  tileExecutions$.pipe(map((e) => e.symbol)),
  rfqThresholdDrops$,
).pipe(map((symbol) => ({ symbol })))

const rfqTileStateMap$ = mergeWithKey({
  reset: resets$,
  requestCancellations: requestCancellations$.pipe(
    map((symbol) => ({ symbol })),
  ),
  quoteRequestClicks: quoteRequestClicks$.pipe(map((symbol) => ({ symbol }))),
  rejections: rejections$.pipe(map((symbol) => ({ symbol }))),
  quoteResponses: quoteResponses$.pipe(
    map((response) => ({
      symbol: response.price.symbol,
      quoteResponse: response,
    })),
  ),
}).pipe(
  split(
    (event) => event.payload.symbol,
    (event$, symbol) =>
      event$.pipe(
        scan(
          (acc, event) => {
            if (event.type === "reset") {
              return {
                quoteState: QuoteState.Init,
              }
            }

            if (event.type === "quoteResponses") {
              return {
                quoteState: QuoteState.Received,
                rfqResponse: event.payload.quoteResponse,
              }
            }

            if (event.type === "rejections") {
              return {
                quoteState: QuoteState.Rejected,
                rfqResponse: acc.rfqResponse,
              }
            }

            if (event.type === "quoteRequestClicks") {
              return {
                quoteState: QuoteState.Requested,
                rfqResponse: acc.rfqResponse,
              }
            }

            if (event.type === "requestCancellations") {
              return {
                quoteState: acc.rfqResponse
                  ? QuoteState.Rejected
                  : QuoteState.Init,
                rfqResponse: acc.rfqResponse,
              }
            }

            throw new Error()
          },
          { quoteState: QuoteState.Init } as RfqState,
        ),
        tap((state) => {
          if (state.quoteState === QuoteState.Requested) {
            dispatchQuoteRequest(symbol)
          }
        }),
      ),
  ),
  collect(),
)

const [useRfqState, getRfqState$] = symbolBind(
  (symbol: string) => getGroupedObservable(rfqTileStateMap$, symbol),
  { quoteState: QuoteState.Init },
)

export { useRfqState, getRfqState$ }

const [useIsRfq, isRfq$] = symbolBind((symbol: string) =>
  getNotional$(symbol).pipe(
    scan((wasRfq, newNotional) => {
      const isRfq = parseFloat(newNotional) >= 10_000_000
      if (wasRfq && !isRfq) {
        onRfqThresholdDrop(symbol)
      }
      return isRfq
    }, false),
  ),
)

export { useIsRfq, isRfq$ }
