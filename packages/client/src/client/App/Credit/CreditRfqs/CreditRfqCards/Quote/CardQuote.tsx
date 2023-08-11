import { createSignal } from "@react-rxjs/utils"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  QuoteBody,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  RfqState,
} from "generated/TradingGateway"
import { FaCheckCircle } from "react-icons/fa"
import { exhaustMap } from "rxjs/operators"
import { acceptCreditQuote$ } from "services/credit"
import { INACTIVE_PASSED_QUOTE_STATE, useQuoteState } from "services/credit"

import {
  AcceptQuoteButton,
  DealerName,
  Price,
  QuoteDot,
  QuoteDotWrapper,
  QuoteRow,
} from "./styled"

const [acceptRfq$, onAcceptRfq] = createSignal<number>()

acceptRfq$
  .pipe(exhaustMap((quoteId) => acceptCreditQuote$({ quoteId })))
  .subscribe()

const pricedQuoteStates = [
  PENDING_WITH_PRICE_QUOTE_STATE,
  ACCEPTED_QUOTE_STATE,
  REJECTED_WITH_PRICE_QUOTE_STATE,
]

export const Quote = ({
  dealer,
  quote,
  rfqState,
  rfqId,
  direction,
  highlight,
}: {
  dealer: DealerBody
  quote: QuoteBody | undefined
  rfqState: RfqState
  rfqId: number
  direction: Direction
  highlight: boolean
}) => {
  const state = useQuoteState(dealer.id, rfqId)

  const hasPrice = pricedQuoteStates.includes(state.type)
  const acceptable = state.type === PENDING_WITH_PRICE_QUOTE_STATE
  const accepted = state.type === ACCEPTED_QUOTE_STATE
  const passed = quote?.state.type === PASSED_QUOTE_STATE
  const rfqOpen = rfqState === RfqState.Open

  return (
    <QuoteRow
      quoteActive={!!quote && rfqOpen}
      highlight={highlight}
      direction={direction}
    >
      {(acceptable || state.type !== INACTIVE_PASSED_QUOTE_STATE) && rfqOpen && (
        <QuoteDotWrapper>
          <QuoteDot
            highlight={highlight}
            direction={direction}
            isPassed={state.type === PASSED_QUOTE_STATE}
          />
        </QuoteDotWrapper>
      )}
      <DealerName open={rfqOpen} accepted={accepted} priced={hasPrice}>
        {dealer?.name ?? "Dealer name not found"}
      </DealerName>
      <Price
        open={rfqOpen}
        accepted={accepted}
        passed={passed}
        priced={hasPrice}
        highlight={highlight}
        direction={direction}
      >
        {accepted && <FaCheckCircle size={16} />}
        {quote && typeof state.payload === "number"
          ? `$${state.payload}`
          : state.payload}
      </Price>
      {acceptable && (
        <AcceptQuoteButton onClick={() => quote && onAcceptRfq(quote.id)}>
          Accept
        </AcceptQuoteButton>
      )}
    </QuoteRow>
  )
}
