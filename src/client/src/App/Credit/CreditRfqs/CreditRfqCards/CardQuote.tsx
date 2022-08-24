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
  LatestQuoteDot,
  Price,
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
  latest,
}: {
  dealer: DealerBody
  quote: QuoteBody | undefined
  rfqState: RfqState
  direction: Direction
  highlight: boolean
  latest: boolean
}) => {
  return (
    <QuoteRow
      quoteActive={!!quote && rfqState === RfqState.Open}
      highlight={highlight}
      direction={direction}
    >
      <DealerName
        open={rfqState === RfqState.Open}
        accepted={quote?.state === QuoteState.Accepted}
      >
        {latest && rfqState === RfqState.Open && (
          <LatestQuoteDot direction={direction} />
        )}
        {dealer?.name ?? "Dealer name not found"}
      </DealerName>
      <Price
        open={rfqState === RfqState.Open}
        accepted={quote?.state === QuoteState.Accepted}
      >
        {quote?.state === QuoteState.Accepted && <FaCheckCircle size={16} />}
        {quote ? `$${quote.price.toString()}` : "Awaiting response"}
      </Price>
      <AcceptQuoteButton onClick={() => onAcceptRfq(quote!.id)}>
        Accept
      </AcceptQuoteButton>
    </QuoteRow>
  )
}
