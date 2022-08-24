import { Loader } from "@/components/Loader"
import {
  DealerBody,
  Direction,
  QuoteBody,
  QuoteState,
  RfqState,
} from "@/generated/TradingGateway"
import {
  acceptCreditQuote$,
  clearedRfqIds$,
  creditRfqsById$,
  RfqDetails,
  useCreditRfqDetails,
  useLatestQuote,
  useQuoteRowHighlight,
} from "@/services/credit"
import { customNumberFormatter } from "@/utils"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { combineLatest } from "rxjs"
import { exhaustMap, map } from "rxjs/operators"
import { ALL_RFQ_STATES, selectedRfqState$ } from "../selectedRfqState"
import { CardFooter } from "./CardFooter"
import { CardHeader } from "./CardHeader"
import {
  AcceptQuoteButton,
  CardContainer,
  CreditRfqCardsWrapper,
  DealerName,
  DetailsWrapper,
  Label,
  NoRfqsWrapper,
  Price,
  Quantity,
  LatestQuoteDot,
  QuoteRow,
  QuotesContainer,
} from "./styled"

const formatter = customNumberFormatter()

const Details = ({ quantity }: { quantity: number }) => {
  return (
    <DetailsWrapper>
      <Label>RFQ DETAILS</Label>
      <Quantity>QTY: {formatter(quantity)}</Quantity>
    </DetailsWrapper>
  )
}

const [acceptRfq$, onAcceptRfq] = createSignal<number>()

acceptRfq$
  .pipe(exhaustMap((quoteId) => acceptCreditQuote$({ quoteId })))
  .subscribe()

const Quote = ({
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

const sortByPriceFunc =
  (quotes: QuoteBody[]) => (d1: DealerBody, d2: DealerBody) => {
    const d1Quote = quotes.find((quote) => quote.dealerId === d1.id)
    const d2Quote = quotes.find((quote) => quote.dealerId === d2.id)
    if (!d2Quote) {
      return -1
    } else if (!d1Quote) {
      return 1
    } else {
      return d2Quote.price - d1Quote.price
    }
  }

const Card = ({ id }: { id: number }) => {
  const rfqDetails = useCreditRfqDetails(id)
  const highlightedRow = useQuoteRowHighlight(id)
  const latestQuote = useLatestQuote(id)

  if (!rfqDetails) {
    return <Loader ariaLabel="Loading RFQ" />
  }

  return (
    <CardContainer
      direction={rfqDetails.direction}
      live={rfqDetails.state === RfqState.Open}
    >
      <CardHeader
        direction={rfqDetails.direction}
        instrumentId={rfqDetails.instrumentId}
        rfqState={rfqDetails.state}
      />
      <Details quantity={rfqDetails.quantity} />
      <QuotesContainer>
        {rfqDetails.dealers
          .sort(sortByPriceFunc(rfqDetails.quotes))
          .map((dealer) => {
            const quote = rfqDetails.quotes.find(
              (quote) => quote.dealerId === dealer.id,
            )
            return (
              <Quote
                key={dealer.id}
                dealer={dealer}
                quote={quote}
                rfqState={rfqDetails.state}
                direction={rfqDetails.direction}
                highlight={!!quote && quote.id === highlightedRow}
                latest={!!quote && quote.id === latestQuote}
              />
            )
          })}
      </QuotesContainer>
      <CardFooter rfqDetails={rfqDetails} />
    </CardContainer>
  )
}

function getRfqRemainingTime(rfq: RfqDetails): number {
  return Date.now() - Number(rfq.creationTimestamp) + rfq.expirySecs * 1000
}

function timeRemainingComparator(rfq1: RfqDetails, rfq2: RfqDetails): number {
  return getRfqRemainingTime(rfq1) - getRfqRemainingTime(rfq2)
}

const [useFilteredCreditRfqIds] = bind(
  combineLatest([creditRfqsById$, selectedRfqState$, clearedRfqIds$]).pipe(
    map(([creditRfqsById, selectedRfqState, clearedRfqIds]) => {
      const sortedRfqs = [...Object.values(creditRfqsById)].sort(
        timeRemainingComparator,
      )

      return sortedRfqs
        .filter(
          (rfqDetail) =>
            selectedRfqState === ALL_RFQ_STATES ||
            rfqDetail.state === selectedRfqState,
        )
        .filter((rfqDetail) => !clearedRfqIds.includes(rfqDetail.id))
        .map(({ id }) => id)
    }),
  ),
)

export const CreditRfqCards: FC = () => {
  const rfqIds = useFilteredCreditRfqIds()

  return (
    <CreditRfqCardsWrapper empty={rfqIds.length === 0}>
      {rfqIds.length > 0 ? (
        rfqIds.map((id) => <Card id={id} key={id} />)
      ) : (
        <NoRfqsWrapper>Placeholder text for no RFQs</NoRfqsWrapper>
      )}
    </CreditRfqCardsWrapper>
  )
}
