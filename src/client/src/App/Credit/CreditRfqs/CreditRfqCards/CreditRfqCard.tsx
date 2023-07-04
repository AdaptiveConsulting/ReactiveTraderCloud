import { Loader } from "@/components/Loader"
import {
  DealerBody,
  Direction,
  QuoteBody,
  RfqState,
} from "@/generated/TradingGateway"
import { useCreditRfqDetails } from "@/services/credit"
import { customNumberFormatter } from "@/utils"

import { CardFooter } from "./CardFooter"
import { CardHeader } from "./CardHeader"
import { Quote } from "./Quote/CardQuote"
import {
  CardContainer,
  DetailsWrapper,
  Label,
  Quantity,
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

const sortByPriceFunc =
  (quotes: QuoteBody[], direction: Direction) =>
  (d1: DealerBody, d2: DealerBody) => {
    const d1Quote = quotes.find((quote) => quote.dealerId === d1.id)
    const d2Quote = quotes.find((quote) => quote.dealerId === d2.id)
    if (!d2Quote) {
      return -1
    } else if (!d1Quote) {
      return 1
    } else {
      return direction == "Buy"
        ? d1Quote.price - d2Quote.price
        : d2Quote.price - d1Quote.price
    }
  }

export const Card = ({ id, highlight }: { id: number; highlight: boolean }) => {
  const rfqDetails = useCreditRfqDetails(id)

  if (!rfqDetails) {
    return <Loader ariaLabel="Loading RFQ" />
  }

  return (
    <CardContainer
      direction={rfqDetails.direction}
      live={rfqDetails.state === RfqState.Open}
      highlight={highlight}
    >
      <CardHeader
        direction={rfqDetails.direction}
        instrumentId={rfqDetails.instrumentId}
        rfqState={rfqDetails.state}
      />
      <Details quantity={rfqDetails.quantity} />
      <QuotesContainer data-testid="quotes">
        {rfqDetails.dealers
          .sort(sortByPriceFunc(rfqDetails.quotes, rfqDetails.direction))
          .map((dealer) => {
            const quote = rfqDetails.quotes.find(
              (quote) => quote.dealerId === dealer.id,
            )

            // The highest price is the best quote since we do not have partial fills
            const bestQuote =
              !!quote &&
              rfqDetails.state === RfqState.Open &&
              dealer.name == "Adaptive Bank"
            return (
              <Quote
                key={dealer.id}
                dealer={dealer}
                quote={quote}
                rfqState={rfqDetails.state}
                direction={rfqDetails.direction}
                highlight={bestQuote}
              />
            )
          })}
      </QuotesContainer>
      <CardFooter rfqDetails={rfqDetails} />
    </CardContainer>
  )
}
