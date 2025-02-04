import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { combineLatest, merge } from "rxjs"
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from "rxjs/operators"

import { HIGHLIGHT_ROW_FLASH_TIME } from "@/client/constants"
import {
  applyMaximum,
  DECIMAL_SEPARATOR,
  DECIMAL_SEPARATOR_REGEXP,
  invertDirection,
  THOUSANDS_SEPARATOR_REGEXP,
  truncatedDecimalNumberFormatter,
} from "@/client/utils"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  QuoteState,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
  RfqState,
} from "@/generated/TradingGateway"
import {
  ADAPTIVE_BANK_NAME,
  creditRfqsById$,
  RfqDetails,
} from "@/services/credit"

import { hasPrice, timeRemainingComparator } from "../common"
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
  }
  if (rfqState === RfqState.Cancelled) {
    return SellSideQuoteState.Cancelled
  }
  if (rfqState === RfqState.Expired) {
    return SellSideQuoteState.Expired
  }
  if (quoteState?.type === ACCEPTED_QUOTE_STATE) {
    return SellSideQuoteState.Accepted
  }
  if (rfqState === RfqState.Closed) {
    return SellSideQuoteState.Lost // RFQ closed and quote not accepted
  }
  if (
    quoteState?.type === REJECTED_WITH_PRICE_QUOTE_STATE ||
    quoteState?.type === REJECTED_WITHOUT_PRICE_QUOTE_STATE
  ) {
    return SellSideQuoteState.Rejected
  }
  if (!quoteState || quoteState.type === PENDING_WITHOUT_PRICE_QUOTE_STATE) {
    return SellSideQuoteState.New
  }
  if (quoteState?.type === PENDING_WITH_PRICE_QUOTE_STATE) {
    return SellSideQuoteState.Pending
  }

  throw new Error(`Unable to determine sell side quote state`)
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

const filterAdaptiveDealer = (rfq: RfqDetails) =>
  rfq.dealers.findIndex(
    (dealer: DealerBody) => dealer.name === ADAPTIVE_BANK_NAME,
  ) > -1

const _sellSideRfqs$ = combineLatest([
  creditRfqsById$,
  sellSideQuotesFilter$,
]).pipe(
  map(([record, quoteFilter]) =>
    (Object.values(record) as RfqDetails[])
      .filter(
        (rfq) =>
          filterAdaptiveDealer(rfq) && filterByQuoteState(quoteFilter, rfq),
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
        transformed.price =
          adaptiveQuote && hasPrice(adaptiveQuote.state)
            ? adaptiveQuote.state.payload
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
      distinctUntilChanged(), // should prevent input from clearing when quotes are received
    ),
  ),
  null,
)

const formatter = truncatedDecimalNumberFormatter(4)
const filterRegExp = new RegExp(THOUSANDS_SEPARATOR_REGEXP, "g")
const decimalRegExp = new RegExp(DECIMAL_SEPARATOR_REGEXP, "g")

export const [rawPrice$, setPrice] = createSignal<string>()
export const [usePrice, price$] = bind(
  merge(
    selectedRfqId$.pipe(map(() => ({ value: 0, inputValue: "" }))),
    rawPrice$.pipe(
      map((rawVal) => {
        const lastChar = rawVal.slice(-1).toLowerCase()
        const cleanedInput = rawVal
          .replace(filterRegExp, "")
          .replace(decimalRegExp, ".")

        const inputQuantityAsNumber = Math.abs(Number(cleanedInput))

        // numeric value could be NaN at this stage

        const truncated = formatter(inputQuantityAsNumber)

        const value = applyMaximum(
          Number(
            truncated.replace(filterRegExp, "").replace(decimalRegExp, "."),
          ),
        )

        return {
          value,
          inputValue:
            value === 0
              ? ""
              : formatter(value) +
                (lastChar === DECIMAL_SEPARATOR ? DECIMAL_SEPARATOR : ""),
        }
      }),
      filter(({ value }) => !Number.isNaN(value)),
    ),
  ),
  { value: 0, inputValue: "" },
)
