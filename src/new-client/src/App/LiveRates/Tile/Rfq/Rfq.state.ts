import { concat, of, race, timer } from "rxjs"
import {
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  mapTo,
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators"
import {
  collect,
  createListener,
  getGroupedObservable,
} from "@react-rxjs/utils"
import { rfq$, RfqResponse } from "@/services/rfqs"
import { getTileState$, TileStates } from "../Tile.state"
import { symbolBind } from "../Tile.context"
import { equals } from "@/utils"
import { getNotionalValue$ } from "../Notional"

export const [useIsRfq, isRfq$] = symbolBind(
  (symbol: string) =>
    getNotionalValue$(symbol).pipe(
      map((value) => value >= 10_000_000),
      distinctUntilChanged(),
    ),
  false,
)

export enum QuoteState {
  Init,
  Requested,
  Received,
  Rejected,
}

export const REJECT_TIMEOUT = 2_000

const createSymbolSignal = () => {
  const [input$, onInput] = createListener<string>()
  const source$ = input$.pipe(
    groupBy((x) => x),
    collect(),
  )
  return [
    (key: string, nTake?: number) =>
      getGroupedObservable(source$, key).pipe(nTake ? take(nTake) : (x) => x),
    onInput,
  ] as const
}

const [getQuoteRequested$, onQuoteRequest] = createSymbolSignal()
const [getRequestCancellation$, onCancelRequest] = createSymbolSignal()
const [getRejection$, onRejection] = createSymbolSignal()

export { onRejection, onCancelRequest, onQuoteRequest }

const INIT = { state: QuoteState.Init as const }
const REQUESTED = { state: QuoteState.Requested as const }

const [, _getRfqState$] = symbolBind((symbol) =>
  getQuoteRequested$(symbol).pipe(
    withLatestFrom(getNotionalValue$(symbol)),
    switchMap(([, notional]) =>
      concat(
        of(REQUESTED),
        race([
          getRequestCancellation$(symbol, 1).pipe(mapTo(INIT)),
          rfq$({ symbol, notional }).pipe(
            mergeMap((payload) =>
              concat(
                of({ state: QuoteState.Received as const, payload }),
                race([
                  getTileState$(symbol).pipe(
                    filter((x) => x.status === TileStates.Started),
                    take(1),
                    mapTo(INIT),
                  ),
                  race([getRejection$(symbol, 1), timer(payload.timeout)]).pipe(
                    mergeMap(() =>
                      concat(
                        of({
                          state: QuoteState.Rejected as const,
                          payload,
                        }),
                        timer(REJECT_TIMEOUT).pipe(mapTo(INIT)),
                      ),
                    ),
                  ),
                ]),
              ),
            ),
          ),
        ]),
      ),
    ),
  ),
)

export const [useRfqState, getRfqState$] = symbolBind(
  (symbol) =>
    isRfq$(symbol).pipe(
      switchMap((isRfq) => (isRfq ? _getRfqState$(symbol) : of(INIT))),
    ),
  INIT,
)

export const [useRfqPayload, getRfqPayload$] = symbolBind(
  (symbol) =>
    getRfqState$(symbol).pipe(
      map((rfq) =>
        rfq.state === QuoteState.Init || rfq.state === QuoteState.Requested
          ? null
          : {
              isExpired: rfq.state === QuoteState.Rejected,
              rfqResponse: rfq.payload,
            },
      ),
      distinctUntilChanged(equals),
    ),
  null as null | { isExpired: boolean; rfqResponse: RfqResponse },
)
