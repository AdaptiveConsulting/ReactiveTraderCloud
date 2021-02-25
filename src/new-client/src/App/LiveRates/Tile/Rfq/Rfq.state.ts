import {collect, createListener, mergeWithKey, split} from "@react-rxjs/utils"
import {
  concatAll,
  concatMap,
  exhaustMap,
  map,
  scan,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators"
import {QuoteState, rfq$, RfqResponse} from "services/rfqs"
import {getNotional$, tileExecutions$} from "../Tile.state"
import {symbolBind} from "../Tile.context"
import {EMPTY} from "rxjs"

const [rfqButtonClicks$, onRfqButtonClick] = createListener<string>()

export {onRfqButtonClick}

const [rejections$, onRejection] = createListener<string>()

export {onRejection}

interface RfqState {quoteState: QuoteState, rfqResponse?: RfqResponse}

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
    rfq$({symbol, notional: parseInt(notional)}),
  ),
)

const rfqTileStateMap$ = mergeWithKey({
  reset: tileExecutions$.pipe(map((e) => ({symbol: e.symbol}))),
  rfqButtonClicks: rfqButtonClicks$.pipe(map((symbol) => ({symbol}))),
  rejections: rejections$.pipe(map((symbol) => ({symbol}))),
  quoteResponses: quoteResponses$.pipe(
    map((response) => ({
      symbol: response.price.symbol,
      quoteResponse: response,
    })),
  ),
}).pipe(
  split(
    event => event.payload.symbol,
    (event$, symbol) => event$.pipe(
      scan((acc, event) => {
        if (event.type === 'reset') return {quoteState: QuoteState.Init}

        if (event.type === 'quoteResponses') {
          return {quoteState: QuoteState.Received, rfqResponse: event.payload.quoteResponse}
        }
        if (event.type === 'rejections') {
          if (acc.quoteState === QuoteState.Received) {
            return {quoteState: QuoteState.Rejected, rfqResponse: acc.rfqResponse}
          }
          return acc
        }

        // It's a button click!
        if ([QuoteState.Init, QuoteState.Rejected].includes(acc.quoteState)) return {quoteState: QuoteState.Requested}
        if (acc.quoteState === QuoteState.Requested) return {quoteState: QuoteState.Init}

        throw new Error()
      }, {quoteState: QuoteState.Init} as RfqState),
      tap(state => {
        if (state.quoteState === QuoteState.Requested) {
          console.log('dispatching quote rquest', symbol)
          dispatchQuoteRequest(symbol)
        }
      })
    ),
  ),
  collect()
)

const [useRfqState, getRfqState$] = symbolBind(
  (symbol: string) =>
    rfqTileStateMap$.pipe(exhaustMap(map => map.has(symbol) ? map.get(symbol)! : EMPTY)),
  {quoteState: QuoteState.Init}
)

export {useRfqState, getRfqState$}

const [useIsRfq, isRfq$] = symbolBind((symbol: string) =>
  getNotional$(symbol).pipe(
    map((newNotional) => parseFloat(newNotional) >= 10_000_000),
  ),
)

export {useIsRfq, isRfq$}
