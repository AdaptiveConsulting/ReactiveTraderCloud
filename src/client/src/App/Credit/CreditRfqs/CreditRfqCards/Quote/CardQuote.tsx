import { FaCheckCircle } from "react-icons/fa"
import { exhaustMap } from "rxjs/operators"
import { createSignal } from "@react-rxjs/utils"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  QuoteBody,
  QuoteState,
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  RfqState,
} from "@/generated/NewTradingGateway"
import { acceptCreditQuote$ } from "@/services/credit"

import {
  AcceptQuoteButton,
  PassQuoteButton,
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

export const Quote = ({
  dealer,
  quote,
  rfqState,
  direction,
  highlight,
}: {
  dealer: DealerBody
  quote: QuoteBody | undefined
  rfqState: RfqState
  direction: Direction
  highlight: boolean
}) => {
  //I would like to consolidate these functions
  const isQuotePriced = (quote: QuoteBody) => {
    switch (quote.state.type) {
      case PENDING_WITH_PRICE_QUOTE_STATE:
        return true
      case ACCEPTED_QUOTE_STATE:
        return true
      case REJECTED_WITH_PRICE_QUOTE_STATE:
        return true
      default:
        return false
    }
  }

  const handleQuoteState = (quote: QuoteBody) => {
    switch (quote.state.type) {
      case PENDING_WITHOUT_PRICE_QUOTE_STATE:
        return "Awaiting response"
      case PENDING_WITH_PRICE_QUOTE_STATE:
        return `$${quote?.state?.payload.toString()}`
      case PASSED_QUOTE_STATE:
        return "Passed"
      case ACCEPTED_QUOTE_STATE:
        return "Accepted"
      case REJECTED_WITH_PRICE_QUOTE_STATE:
        return "Rejected"
      case REJECTED_WITHOUT_PRICE_QUOTE_STATE:
        return "Rejected"
      default:
        break
    }
  }

  const isQuoteStateTerminal = (stateType: string | undefined) => {
    switch (stateType) {
      case PENDING_WITHOUT_PRICE_QUOTE_STATE:
        return true
      case PENDING_WITH_PRICE_QUOTE_STATE:
        return false
      case PASSED_QUOTE_STATE:
        return true
      case ACCEPTED_QUOTE_STATE:
        return false
      case REJECTED_WITH_PRICE_QUOTE_STATE:
        return false
      case REJECTED_WITHOUT_PRICE_QUOTE_STATE:
        return false
      default:
        return false
        break
    }
  }

  const rfqOpen = rfqState === RfqState.Open
  const priced = quote ? isQuotePriced(quote) : false
  const accepted = quote?.state.type === ACCEPTED_QUOTE_STATE
  return (
    <QuoteRow
      quoteActive={!!quote && rfqOpen}
      highlight={highlight}
      direction={direction}
    >
      <DealerName open={rfqOpen} accepted={accepted} priced={priced}>
        {priced && rfqOpen && (
          <QuoteDotWrapper>
            <QuoteDot highlight={highlight} direction={direction} />
          </QuoteDotWrapper>
        )}
        {dealer?.name ?? "Dealer name not found"}
      </DealerName>
      <Price
        open={rfqOpen}
        accepted={accepted}
        priced={priced}
        highlight={highlight}
        direction={direction}
      >
        {accepted && <FaCheckCircle size={16} />}
        {quote && handleQuoteState(quote)}
      </Price>
      {!isQuoteStateTerminal(quote?.state.type) ? (
        <AcceptQuoteButton onClick={() => quote && onAcceptRfq(quote.id)}>
          Accept
        </AcceptQuoteButton>
      ) : (
        <></>
      )}
    </QuoteRow>
  )
}
