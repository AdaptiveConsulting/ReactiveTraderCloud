import {
  DealerBody,
  Direction,
  QuoteBody,
  QuoteState,
  RfqState,
} from "@/generated/TradingGateway"
import { acceptCreditQuote$ } from "@/services/credit"
import { createSignal } from "@react-rxjs/utils"
import { FaCheckCircle } from "react-icons/fa"
import { exhaustMap } from "rxjs/operators"
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
  const priced = quote?.price !== undefined
  const rfqOpen = rfqState === RfqState.Open
  const accepted = quote?.state === QuoteState.Accepted
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
        {quote ? `$${quote.price.toString()}` : "Awaiting response"}
      </Price>
      <AcceptQuoteButton onClick={() => quote && onAcceptRfq(quote.id)}>
        Accept
      </AcceptQuoteButton>
    </QuoteRow>
  )
}
