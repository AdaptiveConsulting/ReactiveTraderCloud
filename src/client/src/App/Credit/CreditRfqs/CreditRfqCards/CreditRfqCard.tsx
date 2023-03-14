import { Loader } from "@/components/Loader"
import {
  DealerBody,
  QuoteBody,
  RfqState,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
} from "@/generated/NewTradingGateway"
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

//Order
//Low
//  |
//High
//Awaiting Response
//Passed
const assignValues = (quote: QuoteBody): Number | undefined => {
  switch (quote.state.type) {
    case PENDING_WITH_PRICE_QUOTE_STATE:
      return quote.state.payload
      break
    case PENDING_WITHOUT_PRICE_QUOTE_STATE:
      return Number.MAX_SAFE_INTEGER - 1
      break
    case PASSED_QUOTE_STATE:
      return Number.MAX_SAFE_INTEGER
      break
    default:
      return 0
      break
  }
}

const sortByPriceFunc =
  (quotes: QuoteBody[], direction: Direction) =>
  (d1: DealerBody, d2: DealerBody) => {
    const d1Value = assignValues(
      quotes.find((quote) => quote.dealerId === d1.id),
    )
    const d2Value = assignValues(
      quotes.find((quote) => quote.dealerId === d2.id),
    )
    if (!d2Value) {
      return -1
    } else if (!d1Value) {
      return 1
    } else {
      return direction === "Buy" ? d1Value - d2Value : d2Value - d1Value
    }
  }

export const Card = ({ id }: { id: number }) => {
  const rfqDetails = useCreditRfqDetails(id)

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
      <QuotesContainer data-testid="quotes">
        {rfqDetails.dealers
          .sort(sortByPriceFunc(rfqDetails.quotes, rfqDetails.direction))
          .map((dealer) => {
            const quote = rfqDetails.quotes.find(
              (quote) => quote.dealerId === dealer.id,
            )
            // The highest price is the best quote since we do not have partial fills
            const highlight =
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
                highlight={highlight}
              />
            )
          })}
      </QuotesContainer>
      <CardFooter rfqDetails={rfqDetails} />
    </CardContainer>
  )
}
