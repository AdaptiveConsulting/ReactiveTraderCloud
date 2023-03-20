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
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  RfqState,
} from "@/generated/NewTradingGateway"
import { acceptCreditQuote$ } from "@/services/credit"

import {
  AcceptQuoteButton,
  DealerName,
  Price,
  QuoteDot,
  QuoteDotWrapper,
  QuoteRow,
} from "./styled"
import { useEffect, useState } from "react"

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
  const pricedQuoteStates = [
    PENDING_WITH_PRICE_QUOTE_STATE,
    ACCEPTED_QUOTE_STATE,
    REJECTED_WITH_PRICE_QUOTE_STATE,
  ]

  const stateType = quote?.state.type ? quote?.state.type : ""
  const priced = pricedQuoteStates.includes(stateType)
  const acceptable = quote?.state.type === PENDING_WITH_PRICE_QUOTE_STATE
  const passed = quote?.state.type === PASSED_QUOTE_STATE
  const accepted = quote?.state.type === ACCEPTED_QUOTE_STATE
  const rfqOpen = rfqState === RfqState.Open
  const [passedState, setPassedState] = useState(false)

  useEffect(() => {
    if (passed) {
      setPassedState(true)
      const timeout = setTimeout(function () {
        setPassedState(false)
      }, 6000)
      return function () {
        clearTimeout(timeout)
      }
    }
  }, [passed])

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
      case REJECTED_WITHOUT_PRICE_QUOTE_STATE:
        return "Rejected"
      default:
        break
    }
  }

  return (
    <QuoteRow
      quoteActive={!!quote && rfqOpen}
      highlight={highlight}
      direction={direction}
    >
      {acceptable && rfqOpen && (
        <QuoteDotWrapper>
          <QuoteDot highlight={highlight} direction={direction} />
        </QuoteDotWrapper>
      )}
      {passedState && rfqOpen && (
        //Color of animation needs to be changed
        <QuoteDotWrapper>
          <QuoteDot highlight={highlight} direction={direction} />
        </QuoteDotWrapper>
      )}
      <DealerName open={rfqOpen} accepted={accepted} priced={priced}>
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
      {acceptable && (
        <AcceptQuoteButton onClick={() => quote && onAcceptRfq(quote.id)}>
          Accept
        </AcceptQuoteButton>
      )}
    </QuoteRow>
  )
}
