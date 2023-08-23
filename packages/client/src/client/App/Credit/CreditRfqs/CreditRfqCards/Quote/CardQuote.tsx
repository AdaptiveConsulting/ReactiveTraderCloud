import { createSignal } from "@react-rxjs/utils"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  QuoteBody,
  RfqState,
} from "generated/TradingGateway"
import { FaCheckCircle } from "react-icons/fa"
import { exhaustMap } from "rxjs/operators"
import { acceptCreditQuote$ } from "services/credit"
import { useQuoteState } from "services/credit"

import { hasPrice } from "../../../common"
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

interface QuoteProps {
  dealer: DealerBody
  quote: QuoteBody
  rfqState: RfqState
  rfqId: number
  direction: Direction
  highlight: boolean
}

export const Quote = ({
  dealer,
  quote,
  rfqState,
  rfqId,
  direction,
  highlight,
}: QuoteProps) => {
  const state = useQuoteState(dealer.id, rfqId)

  const rfqOpen = rfqState === RfqState.Open
  const priced = hasPrice(quote.state)
  const acceptable = state.type === PENDING_WITH_PRICE_QUOTE_STATE && rfqOpen
  const accepted = state.type === ACCEPTED_QUOTE_STATE
  const passed = quote.state.type === PASSED_QUOTE_STATE

  return (
    <QuoteRow
      quoteActive={acceptable}
      highlight={highlight}
      direction={direction}
    >
      {(acceptable || state.type === PASSED_QUOTE_STATE) && rfqOpen && (
        <QuoteDotWrapper>
          <QuoteDot
            highlight={highlight}
            direction={direction}
            passed={state.type === PASSED_QUOTE_STATE}
          />
        </QuoteDotWrapper>
      )}
      <DealerName open={rfqOpen} accepted={accepted} priced={priced}>
        {dealer?.name ?? "Dealer name not found"}
      </DealerName>
      <Price
        open={rfqOpen}
        accepted={accepted}
        passed={passed}
        priced={priced}
        highlight={highlight}
        direction={direction}
      >
        {accepted && <FaCheckCircle size={16} />}
        {state.payload}
      </Price>
      <AcceptQuoteButton onClick={() => onAcceptRfq(quote.id)}>
        Accept
      </AcceptQuoteButton>
    </QuoteRow>
  )
}
