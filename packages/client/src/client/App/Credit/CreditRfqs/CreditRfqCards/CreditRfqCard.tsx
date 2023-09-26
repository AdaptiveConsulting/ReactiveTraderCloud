import { Loader } from "@/client/components/Loader"
import { customNumberFormatter } from "@/client/utils"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  QuoteBody,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  RfqState,
} from "@/generated/TradingGateway"
import { useCreditRfqDetails } from "@/services/credit"

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

const assignNumericalValue = (
  quote: QuoteBody | undefined,
  direction: Direction,
): number | undefined => {
  if (!quote) {
    return
  } else {
    switch (quote.state.type) {
      case PENDING_WITH_PRICE_QUOTE_STATE:
      case REJECTED_WITH_PRICE_QUOTE_STATE:
      case ACCEPTED_QUOTE_STATE:
        return quote.state.payload
      case PENDING_WITHOUT_PRICE_QUOTE_STATE:
        return direction === "Buy"
          ? Number.MAX_SAFE_INTEGER - 1
          : Number.MIN_SAFE_INTEGER + 1
      case PASSED_QUOTE_STATE:
        return direction === "Buy"
          ? Number.MAX_SAFE_INTEGER
          : Number.MIN_SAFE_INTEGER
      default:
        return 0
    }
  }
}

const sortByPriceFunc =
  (quotes: QuoteBody[], direction: Direction) =>
  (d1: DealerBody, d2: DealerBody) => {
    const d1Value: number | undefined = assignNumericalValue(
      quotes.find((quote) => quote.dealerId === d1.id),
      direction,
    )
    const d2Value = assignNumericalValue(
      quotes.find((quote) => quote.dealerId === d2.id),
      direction,
    )
    if (!d2Value) {
      return -1
    } else if (!d1Value) {
      return 1
    } else {
      return direction === "Buy" ? d1Value - d2Value : d2Value - d1Value
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
            if (!quote) {
              return null
            }

            // The highest price is the best quote since we do not have partial fills
            const bestQuote =
              rfqDetails.state === RfqState.Open &&
              quote.state.type === PENDING_WITH_PRICE_QUOTE_STATE &&
              dealer.name == "Adaptive Bank"
            return (
              <Quote
                key={dealer.id}
                dealer={dealer}
                quote={quote}
                rfqId={rfqDetails.id}
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
