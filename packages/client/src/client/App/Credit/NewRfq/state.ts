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
import {
  applyMaximum,
  createApplyCharacterMultiplier,
  parseQuantity,
} from "@/client/utils"
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

const CLEAR_DEALER_IDS = -1

const applyCharacterMultiplier = createApplyCharacterMultiplier(["k", "m"])

const prepareStream$ = <T>(source$: Observable<T>, startsWithValue: T) =>
  merge(source$, reset$.pipe(map(() => startsWithValue))).pipe(
    startWith(startsWithValue),
  )

// We always want the Adaptive Dealer to be at the top of the list
const [useSortedCreditDealers] = bind(
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
const [rfqRequest$, sendRfq] = createSignal()
const [_direction$, setDirection] = createSignal<Direction>()
const [_instrumentId$, setInstrumentId] = createSignal<number | null>()
const [_quantity$, setQuantity] = createSignal<string>()
const [_dealerIds$, updateDealerIds] = createSignal<{
  id: number
  checked: boolean
}>()

const direction$ = prepareStream$(_direction$, Direction.Buy)
const instrumentId$ = prepareStream$(_instrumentId$, null)
const quantity$ = prepareStream$(_quantity$, "").pipe(
  map((quantity) => {
    const numValue = Math.trunc(Math.abs(parseQuantity(quantity)))
    const lastChar = quantity.slice(-1).toLowerCase()
    const value = applyCharacterMultiplier(numValue, lastChar)
    return !Number.isNaN(value) ? applyMaximum(value) : 0
  }),
)
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

const [useFormState, state$] = bind(
  combineLatest([direction$, instrumentId$, quantity$, dealerIds$]),
)

const [useIsValid, valid$] = bind(
  state$.pipe(
    map(
      ([, instrumentId, quantity, dealerIds]) =>
        !!(instrumentId !== null && quantity && dealerIds.length),
    ),
  ),
  false,
)

const request$ = rfqRequest$.pipe(
  withLatestFrom(valid$),
  filter(([, valid]) => valid),
  switchMap(() =>
    state$.pipe(
      take(1),
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
  CLEAR_DEALER_IDS,
  instrumentId$,
  request$,
  reset$,
  sendRfq,
  setDirection,
  setInstrumentId,
  setQuantity,
  updateDealerIds,
  useFormState,
  useIsValid,
  useSortedCreditDealers,
}
