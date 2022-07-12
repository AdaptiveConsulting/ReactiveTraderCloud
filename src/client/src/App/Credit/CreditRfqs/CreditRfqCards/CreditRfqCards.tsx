import { Loader } from "@/components/Loader"
import { DealerBody, QuoteBody, RfqState } from "@/generated/TradingGateway"
import {
  acceptCreditQuote$,
  creditRfqsById$,
  useCreditRfqDetails,
} from "@/services/credit"
import { customNumberFormatter } from "@/utils"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
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
}: {
  dealer: DealerBody
  quote: QuoteBody | undefined
  rfqState: RfqState
}) => {
  return (
    <QuoteRow quoteActive={!!quote && rfqState === RfqState.Open}>
      <DealerName>{dealer?.name ?? "Dealer name not found"}</DealerName>
      <Price quoteState={quote?.state}>{quote?.price ?? "--"}</Price>
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

  if (!rfqDetails) {
    return <Loader ariaLabel="Loading RFQ" />
  }

  return (
    <CardContainer>
      <CardHeader
        direction={rfqDetails.direction}
        instrumentId={rfqDetails.instrumentId}
      />
      <Details quantity={rfqDetails.quantity} />
      <QuotesContainer>
        {rfqDetails.dealers
          .sort(sortByPriceFunc(rfqDetails.quotes))
          .map((dealer) => (
            <Quote
              dealer={dealer}
              quote={rfqDetails.quotes.find(
                (quote) => quote.dealerId === dealer.id,
              )}
              rfqState={rfqDetails.state}
              key={dealer.id}
            />
          ))}
      </QuotesContainer>
      <CardFooter
        rfqId={rfqDetails.id}
        state={rfqDetails.state}
        start={Number(rfqDetails.creationTimestamp)}
        end={
          Number(rfqDetails.creationTimestamp) + rfqDetails.expirySecs * 1000
        }
      />
    </CardContainer>
  )
}

const [useFilteredCreditRfqIds] = bind(
  combineLatest([creditRfqsById$, selectedRfqState$]).pipe(
    map(([creditRfqsById, selectedRfqState]) => {
      if (selectedRfqState === ALL_RFQ_STATES) {
        return Object.keys(creditRfqsById).map((rfqId) => parseInt(rfqId, 10))
      }

      return Object.entries(creditRfqsById)
        .filter(([, rfqDetail]) => rfqDetail.state === selectedRfqState)
        .map(([rfqId]) => parseInt(rfqId, 10))
    }),
  ),
)

export const CreditRfqCards: FC = () => {
  const rfqIds = useFilteredCreditRfqIds()

  return (
    <CreditRfqCardsWrapper>
      {rfqIds.length > 0 ? (
        rfqIds.map((id) => <Card id={id} key={id} />)
      ) : (
        <NoRfqsWrapper>Placeholder text for no RFQs</NoRfqsWrapper>
      )}
    </CreditRfqCardsWrapper>
  )
}
