import { bind, SUSPENSE } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  scan,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs"

import { CREDIT_RFQ_EXPIRY_SECONDS } from "@/client/constants"
import { createApplyCharacterMultiplier, parseQuantity } from "@/client/utils"
import {
  ACK_CREATE_RFQ_RESPONSE,
  DealerBody,
  Direction,
} from "@/generated/TradingGateway"
import {
  ADAPTIVE_BANK_NAME,
  createCreditRfq$,
  creditDealers$,
} from "@/services/credit"

// We always want the Adaptive Dealer to be at the top of the list
export const [useSortedCreditDealers] = bind(
  creditDealers$.pipe(
    map((dealers) => {
      const sortedDealers = dealers.reduce((sortedDealers, dealer) => {
        if (dealer.name === ADAPTIVE_BANK_NAME) {
          sortedDealers.unshift(dealer)
        } else {
          sortedDealers.push(dealer)
        }
        return sortedDealers
      }, [] as DealerBody[])

      // suspend until we have a least one dealer as it makes no sense to render the RFQ form without being able to select a dealer
      return sortedDealers.length > 0 ? sortedDealers : SUSPENSE
    }),
  ),
)
const [reset$, clear] = createSignal<void>()

const prepareStream$ = <T>(source$: Observable<T>, startsWithValue: T) =>
  merge(source$, reset$.pipe(map(() => startsWithValue))).pipe(
    startWith(startsWithValue),
  )
const applyCharacterMultiplier = createApplyCharacterMultiplier(["k", "m"])

const [_direction$, setDirection] = createSignal<Direction>()
const direction$ = prepareStream$(_direction$, Direction.Buy)

const [_instrumentId$, setInstrumentId] = createSignal<number | null>()
const instrumentId$ = prepareStream$(_instrumentId$, null)

const [_quantity$, setQuantity] = createSignal<string>()
const quantity$ = prepareStream$(_quantity$, "").pipe(
  map((quantity) => {
    const numValue = Math.trunc(Math.abs(parseQuantity(quantity)))
    const lastChar = quantity.slice(-1).toLowerCase()
    const value = applyCharacterMultiplier(numValue, lastChar)
    return !Number.isNaN(value) ? value : 0
  }),
)

const [_dealerIds$, setDealerIds] = createSignal<{
  id: number
  checked: boolean
}>()
const dealerIds$ = merge(
  _dealerIds$,
  reset$.pipe(map(() => ({ id: CLEAR_DEALER_IDS, checked: false }))),
).pipe(
  scan<{ id: number; checked: boolean }, number[]>((acc, { id, checked }) => {
    if (id === CLEAR_DEALER_IDS) {
      return []
    }

    if (checked) {
      return [...acc, id]
    }

    return acc.filter((value) => value !== id)
  }, []),
  startWith([] as number[]),
)

export const CLEAR_DEALER_IDS = -1

const [useFormState, state$] = bind(
  combineLatest([direction$, instrumentId$, quantity$, dealerIds$]),
)

const [useIsValid, valid$] = bind(
  combineLatest([instrumentId$, quantity$, dealerIds$]).pipe(
    map(
      ([instrumentId, quantity, dealerIds]) =>
        !!(instrumentId && quantity && dealerIds.length),
    ),
  ),
  false,
)

const [rfqRequest$, sendRfq] = createSignal()

const request$ = rfqRequest$.pipe(
  withLatestFrom(valid$),
  filter(([, valid]) => valid),
  switchMap(() =>
    state$.pipe(
      take(1),
      tap(([direction, instrumentId, quantity, dealerIds]) => {
        console.log(direction, instrumentId, quantity, dealerIds)
      }),
      switchMap(([direction, instrumentId, quantity, dealerIds]) =>
        createCreditRfq$({
          direction,
          quantity,
          dealerIds,
          instrumentId: instrumentId as number,
          expirySecs: CREDIT_RFQ_EXPIRY_SECONDS,
        }),
      ),
      tap((response) => {
        if (response.type === ACK_CREATE_RFQ_RESPONSE) clear()
      }),
    ),
  ),
)

export {
  clear,
  instrumentId$,
  request$,
  reset$,
  sendRfq,
  setDealerIds,
  setDirection,
  setInstrumentId,
  setQuantity,
  useFormState,
  useIsValid,
}
