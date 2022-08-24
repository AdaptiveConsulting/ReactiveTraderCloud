import { Loader } from "@/components/Loader"
import { DealerBody, QuoteBody, RfqState } from "@/generated/TradingGateway"
import {
  useCreditRfqDetails,
  useLatestQuote,
  useQuoteRowHighlight,
} from "@/services/credit"
import { customNumberFormatter } from "@/utils"
import { CardFooter } from "./CardFooter"
import { CardHeader } from "./CardHeader"
import { Quote } from "./CardQuote"
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

export const Card = ({ id }: { id: number }) => {
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
