import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { HIGHLIGHT_ROW_FLASH_TIME } from "client/constants"
import { invertDirection } from "client/utils"
import {
  PASSED_QUOTE_STATE,
  QuoteState,
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
  RfqState,
} from "generated/TradingGateway"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  PendingWithPriceQuoteState,
  REJECTED_WITH_PRICE_QUOTE_STATE,
} from "generated/TradingGateway"
import { combineLatest, merge } from "rxjs"
import { delay, filter, map, startWith, tap } from "rxjs/operators"
import {
  ADAPTIVE_BANK_NAME,
  creditRfqsById$,
  RfqDetails,
} from "services/credit"

import { timeRemainingComparator } from "../common"
import { RfqRow } from "./SellSideRfqGrid"

export enum SellSideQuoteState {
  New = "New RFQ",
  Pending = "Quote Sent",
  Expired = "Expired",
  Cancelled = "Cancelled",
  Lost = "Traded Away",
  Rejected = "Rejected",
  Passed = "Passed",
  Accepted = "Done",
}

export const getSellSideQuoteState = (
  rfqState: RfqState,
  quoteState: QuoteState | undefined,
): SellSideQuoteState => {
  if (quoteState?.type === PASSED_QUOTE_STATE) {
    return SellSideQuoteState.Passed
  } else if (rfqState === RfqState.Cancelled) {
    return SellSideQuoteState.Cancelled
  } else if (rfqState === RfqState.Expired) {
    return SellSideQuoteState.Expired
  } else if (
    rfqState === RfqState.Open &&
    (!quoteState || quoteState.type === PENDING_WITHOUT_PRICE_QUOTE_STATE)
  ) {
    return SellSideQuoteState.New
  } else if (
    rfqState === RfqState.Open &&
    quoteState?.type === PENDING_WITH_PRICE_QUOTE_STATE
  ) {
    return SellSideQuoteState.Pending
  } else if (
    rfqState === RfqState.Closed &&
    quoteState?.type !== ACCEPTED_QUOTE_STATE
  ) {
    return SellSideQuoteState.Lost
  } else if (
    quoteState?.type === REJECTED_WITH_PRICE_QUOTE_STATE ||
    quoteState?.type === REJECTED_WITHOUT_PRICE_QUOTE_STATE
  ) {
    return SellSideQuoteState.Rejected
  } else if (quoteState?.type === ACCEPTED_QUOTE_STATE) {
    return SellSideQuoteState.Accepted
  } else {
    throw new Error()
  }
}

const [_highlightRfqId$, highlightRfqId] = createSignal<number | null>()
export { highlightRfqId }

export const [useHighlightedRfqId] = bind(
  merge(
    _highlightRfqId$,
    _highlightRfqId$.pipe(
      map(() => null),
      delay(HIGHLIGHT_ROW_FLASH_TIME),
    ),
  ),
  null,
)

export enum SellSideQuotesTab {
  All = "All RFQs",
  Live = "Live RFQs",
  Closed = "Closed RFQs",
}

export const SELLSIDE_RFQS_TABS: SellSideQuotesTab[] =
  Object.values(SellSideQuotesTab)

const [_sellSideQuotesFilter$, setQuotesFilter] =
  createSignal<SellSideQuotesTab>()

export { setQuotesFilter }
export const [useSellSideQuotesFilter, sellSideQuotesFilter$] = bind(
  _sellSideQuotesFilter$.pipe(startWith(SellSideQuotesTab.All)),
  SellSideQuotesTab.All,
)

const filterByQuoteState = (
  quoteFilterState: SellSideQuotesTab,
  rfq: RfqDetails,
) => {
  switch (quoteFilterState) {
    case SellSideQuotesTab.Closed:
      return rfq.state !== RfqState.Open
    case SellSideQuotesTab.Live:
      return rfq.state === RfqState.Open
    case SellSideQuotesTab.All:
      return true
    default:
      throw new Error("Attempt to filter on unknown Rfq quote filter state")
  }
}

const filterByIsAdaptiveRfq = (rfq: RfqDetails) => {
  console.log(rfq)
  return (
    rfq.dealers.findIndex(
      (dealer: DealerBody) => dealer.name === ADAPTIVE_BANK_NAME,
    ) > -1
  )
}

const _sellSideRfqs$ = combineLatest([
  creditRfqsById$,
  sellSideQuotesFilter$,
]).pipe(
  tap(([record]) => console.log(record)),
  map(([record, quoteFilter]) =>
    (Object.values(record) as RfqDetails[])
      .filter(
        (rfq) =>
          filterByIsAdaptiveRfq(rfq) && filterByQuoteState(quoteFilter, rfq),
      )
      .sort(timeRemainingComparator)
      .reduce((rows, rfq) => {
        const transformed = {} as RfqRow
        const adaptive = rfq.dealers.find(
          (dealer) => dealer.name === ADAPTIVE_BANK_NAME,
        )
        const adaptiveQuote = rfq.quotes.find(
          (quote) => quote.dealerId === adaptive?.id,
        )
        transformed.id = rfq.id
        transformed.direction = transformed.direction = invertDirection(
          rfq.direction,
        )
        transformed.status = getSellSideQuoteState(
          rfq.state,
          adaptiveQuote?.state,
        )
        transformed.cpy = "AAM"
        transformed.security = rfq.instrument?.name ?? "NA"
        transformed.quantity = rfq.quantity
        // TODO (2988) - logic needs looking at here - what does RFQ Row do with un-Adaptive-quoted RFQ
        transformed.price = (adaptiveQuote?.state as PendingWithPriceQuoteState)
          ?.payload
          ? (adaptiveQuote?.state as PendingWithPriceQuoteState)?.payload
          : 0
        transformed.timer =
          rfq.state !== RfqState.Open
            ? undefined
            : Number(rfq.creationTimestamp) + rfq.expirySecs * 1000
        return [...rows, transformed]
      }, [] as RfqRow[]),
  ),
)

export const [useSellSideRfqs, sellSideRfqs$] = bind(_sellSideRfqs$)

const [_selectedRfqId$, selectRfqId] = createSignal<number | null>()
export { selectRfqId }
export const [useSelectedRfqId, selectedRfqId$] = bind(
  merge(
    _selectedRfqId$,
    sellSideRfqs$.pipe(
      map((rfqs) => rfqs.at(0)?.id),
      filter(Boolean),
    ),
  ),
  null,
)
