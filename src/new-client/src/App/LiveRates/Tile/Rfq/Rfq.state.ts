import { concat, Observable, race, timer } from "rxjs"
import {
  distinctUntilChanged,
  exhaustMap,
  map,
  mapTo,
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators"
import { createKeyedSignal } from "@react-rxjs/utils"
import { rfq$, RfqResponse } from "@/services/rfqs"
import { tileExecutions$ } from "../Tile.state"
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

export enum QuoteStateStage {
  Init,
  Requested,
  Received,
  Rejected,
}
export type QuoteState =
  | { stage: QuoteStateStage.Init }
  | { stage: QuoteStateStage.Requested }
  | { stage: QuoteStateStage.Received; payload: RfqResponse }
  | { stage: QuoteStateStage.Rejected; payload: RfqResponse }

const INIT: QuoteState = { stage: QuoteStateStage.Init }
const REQUESTED: QuoteState = { stage: QuoteStateStage.Requested }

const [quoteRequested$, onQuoteRequest] = createKeyedSignal<string>()
const [cancelRfq$, onCancelRfq] = createKeyedSignal<string>()
const [rejectQuote$, onRejectQuote] = createKeyedSignal<string>()

export { onRejectQuote, onCancelRfq, onQuoteRequest }

const REJECT_TIMEOUT = 2_000
export const [useRfqState, getRfqState$] = symbolBind(
  (symbol): Observable<QuoteState> =>
    quoteRequested$(symbol).pipe(
      withLatestFrom(getNotionalValue$(symbol)),
      exhaustMap(([, notional]) =>
        concat(
          [REQUESTED],
          race([
            cancelRfq$(symbol).pipe(take(1), mapTo(INIT)),
            rfq$({ symbol, notional }).pipe(
              mergeMap((payload) =>
                concat(
                  [{ stage: QuoteStateStage.Received, payload }],
                  race([
                    tileExecutions$(symbol).pipe(mapTo(INIT)),
                    race([rejectQuote$(symbol), timer(payload.timeout)]).pipe(
                      mapTo({
                        stage: QuoteStateStage.Rejected,
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
          [state],
          state.stage === QuoteStateStage.Rejected
            ? timer(REJECT_TIMEOUT).pipe(mapTo(INIT))
            : [],
        ),
      ),
    ),
  INIT,
)

export const [useRfqPayload, getRfqPayload$] = symbolBind(
  (symbol) =>
    getRfqState$(symbol).pipe(
      map((rfq) =>
        rfq.stage === QuoteStateStage.Init ||
        rfq.stage === QuoteStateStage.Requested
          ? null
          : {
              isExpired: rfq.stage === QuoteStateStage.Rejected,
              rfqResponse: rfq.payload,
            },
      ),
      distinctUntilChanged(equals),
    ),
  null as null | { isExpired: boolean; rfqResponse: RfqResponse },
)
