import { concat, Observable, pipe, race, timer } from "rxjs"
import {
  distinctUntilChanged,
  exhaustMap,
  map,
  mapTo,
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
  (symbol): Observable<QuoteState> => {
    const getQuote$ = (notional: number) =>
      rfq$({ symbol, notional }).pipe(
        map((payload) => ({ stage: QuoteStateStage.Received, payload })),
      )

    // The user has decided to cancel the request for the quote
    const userCancellation$ = cancelRfq$(symbol).pipe(take(1), mapTo(INIT))

    // It initially emits REQUESTED and if the quote is received before the user
    // cancels the ongoing request, then it emits the RECEIVED stage, otherwise
    // the user changed their mind and cancelled the request before receiving a
    // response, in which case we go back to INIT
    const requestForQuote = () =>
      pipe(
        withLatestFrom(getNotionalValue$(symbol)),
        // exhaustMap ensures that while the request is taking place we ignore
        // new requests for quote from the user. Using switchMap would cancel
        // the ongoing one and start a new one, but that's not what we want.
        exhaustMap(([, notional]) =>
          concat([REQUESTED], race([userCancellation$, getQuote$(notional)])),
        ),
      )

    // The user has accepted the proposed quote (the execution flow kicks in),
    // so this flow goes back to INIT
    const quoteAccepted$ = tileExecutions$(symbol).pipe(take(1), mapTo(INIT))

    // Either the quote has timed-out or the user has purposely rejected it
    const quoteRejected$ = (payload: RfqResponse) =>
      race([rejectQuote$(symbol), timer(payload.timeout)]).pipe(
        take(1),
        mapTo({
          stage: QuoteStateStage.Rejected,
          payload,
        }),
      )

    const quoteAcceptedOrRejected = () =>
      switchMap((state: QuoteState) =>
        concat(
          [state],
          state.stage === QuoteStateStage.Received
            ? race([quoteAccepted$, quoteRejected$(state.payload)])
            : [],
        ),
      )

    // If the quote got rejected/timed-out, then we want to display the expired
    // quote for some time as expired, and after we want to go back to INIT
    const resetAfterRejection = () =>
      switchMap((state: QuoteState) =>
        concat(
          [state],
          state.stage === QuoteStateStage.Rejected
            ? timer(REJECT_TIMEOUT).pipe(mapTo(INIT))
            : [],
        ),
      )

    return quoteRequested$(symbol).pipe(
      requestForQuote(),
      quoteAcceptedOrRejected(),
      resetAfterRejection(),
    )
  },
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
