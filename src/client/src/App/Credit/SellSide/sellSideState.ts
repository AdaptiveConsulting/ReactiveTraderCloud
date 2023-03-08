import { combineLatest, merge } from "rxjs"
import { map, startWith, delay } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { QuoteState, RfqState } from "@/generated/TradingGateway"
import {
  ADAPTIVE_BANK_NAME,
  creditRfqsById$,
  RfqDetails,
} from "@/services/credit"
import { invertDirection } from "@/utils"
import { timeRemainingComparator } from "../common"
import { RfqRow } from "./SellSideRfqGrid"
import { HIGHLIGHT_ROW_FLASH_TIME } from "@/constants"

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
  if (rfqState === RfqState.Cancelled) {
    return SellSideQuoteState.Cancelled
  } else if (rfqState === RfqState.Expired) {
    return SellSideQuoteState.Expired
  } else if (rfqState === RfqState.Open && quoteState === undefined) {
    return SellSideQuoteState.New
  } else if (
    rfqState === RfqState.Closed &&
    quoteState !== QuoteState.Accepted
  ) {
    return SellSideQuoteState.Lost
  } else if (rfqState === RfqState.Open && quoteState === QuoteState.Pending) {
    return SellSideQuoteState.Pending
  } else if (quoteState === QuoteState.Rejected) {
    return SellSideQuoteState.Rejected
  } else if (quoteState === QuoteState.Accepted) {
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

const [_selectedRfqId$, selectRfqId] = createSignal<number | null>()
export { selectRfqId }
export const [useSelectedRfqId, selectedRfqId$] = bind(_selectedRfqId$, null)

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

const filterByIsAdaptiveRfq = (rfq: RfqDetails) =>
  rfq.dealers.findIndex((dealer) => dealer.name === ADAPTIVE_BANK_NAME) > -1

const _sellSideRfqs$ = combineLatest([
  creditRfqsById$,
  sellSideQuotesFilter$,
]).pipe(
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
        transformed.price = adaptiveQuote?.price ? adaptiveQuote.price : 0
        transformed.timer =
          rfq.state !== RfqState.Open
            ? undefined
            : Number(rfq.creationTimestamp) + rfq.expirySecs * 1000
        return [...rows, transformed]
      }, [] as RfqRow[]),
  ),
)

export const [useSellSideRfqs, sellSideRfqs$] = bind(_sellSideRfqs$)
