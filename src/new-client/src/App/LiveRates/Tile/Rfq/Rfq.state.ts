import { concat, EMPTY, of, race, timer } from "rxjs"
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators"
import { createKeyedSignal } from "@react-rxjs/utils"
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

const [getQuoteRequested$, onQuoteRequest] = createKeyedSignal<string>()
const [getRequestCancellation$, onCancelRequest] = createKeyedSignal<string>()
const [getRejection$, onRejection] = createKeyedSignal<string>()

export { onRejection, onCancelRequest, onQuoteRequest }

const INIT = { state: QuoteState.Init as const }
const REQUESTED = { state: QuoteState.Requested as const }
export const REJECT_TIMEOUT = 2_000

const [, _getRfqState$] = symbolBind((symbol) =>
  getQuoteRequested$(symbol).pipe(
    withLatestFrom(getNotionalValue$(symbol)),
    exhaustMap(([, notional]) =>
      concat(
        of(REQUESTED),
        race([
          getRequestCancellation$(symbol).pipe(take(1), mapTo(INIT)),
          rfq$({ symbol, notional }).pipe(
            mergeMap((payload) =>
              concat(
                of({ state: QuoteState.Received as const, payload }),
                race([
                  getTileState$(symbol).pipe(
                    filter((x) => x.status === TileStates.Started),
                    mapTo(INIT),
                  ),
                  race([getRejection$(symbol), timer(payload.timeout)]).pipe(
                    mapTo({
                      state: QuoteState.Rejected as const,
                      payload,
                    }),
                  ),
                ]).pipe(take(1)),
              ),
            ),
          ),
        ]),
      ),
    ),
    switchMap((state) =>
      concat(
        of(state),
        state.state === QuoteState.Rejected
          ? timer(REJECT_TIMEOUT).pipe(mapTo(INIT))
          : EMPTY,
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
