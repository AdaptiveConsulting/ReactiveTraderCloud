import { getPrice$ } from "@/services/prices"
import { Direction } from "@/services/trades"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
} from "@/utils/formatNumber"
import { map, switchMap } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { CenteringContainer } from "@/components/CenteringContainer"
import { AdaptiveLoader } from "@/components/AdaptiveLoader"
import { sendExecution } from "../Tile.state"
import { useTileCurrencyPair } from "../Tile.context"
import { useRfqState, QuoteStateStage } from "../Rfq"
import {
  TradeButton,
  Price,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
  QuotePriceLoading,
  ExpiredPrice,
  ExpiredPersist,
} from "./PriceButton.styles"
import { of } from "rxjs"
import { useIsNotionalValid } from "../Notional/Notional"
import { getRfqPayload$, QuoteState, useIsRfq } from "../Rfq/Rfq.state"

const getPriceByDirection$ = (symbol: string, direction: Direction) =>
  getPrice$(symbol).pipe(
    map(({ bid, ask }) => (direction === Direction.Buy ? ask : bid)),
    map((price) => ({ isExpired: false, price })),
  )

const [usePrice, getPriceDirection$] = bind(
  (symbol: string, direction: Direction) =>
    getRfqPayload$(symbol).pipe(
      switchMap((payload) =>
        payload
          ? of({
              ...payload,
              price:
                direction === Direction.Buy
                  ? payload.rfqResponse.price.ask
                  : payload.rfqResponse.price.bid,
            })
          : getPriceByDirection$(symbol, direction),
      ),
    ),
)

export const priceButton$ = (direction: Direction) => (symbol: string) =>
  getPriceDirection$(symbol, direction)

const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

const PriceButtonInner: React.FC<{
  direction: Direction
  rfqQuoteState: QuoteState
}> = ({ direction, rfqQuoteState }) => {
  const { pipsPosition, ratePrecision, symbol } = useTileCurrencyPair()
  const { price, isExpired } = usePrice(symbol, direction)
  const isRfq = useIsRfq()
  const isNotionalValid = useIsNotionalValid()
  const disabled =
    price === 0 ||
    !isNotionalValid ||
    (isRfq && rfqQuoteState.stage !== QuoteStateStage.Received)

  const rateString = price.toFixed(ratePrecision)
  const [wholeNumber, fractions_] = rateString.split(".")
  const fractions = fractions_ || "00000"

  const pip = formatToMin2IntDigits(
    Number(fractions.substring(pipsPosition - 2, pipsPosition)),
  )
  const tenth = Number(fractions.substring(pipsPosition, pipsPosition + 1))

  const bigFigureNumber = Number(
    wholeNumber + "." + fractions.substring(0, pipsPosition - 2),
  )
  let bigFigure = formatTo3Digits(bigFigureNumber)
  if (bigFigureNumber === Math.floor(bigFigureNumber)) bigFigure += "."

  return (
    <PriceButtonInnerComponent
      direction={direction}
      rfqQuoteState={rfqQuoteState}
      symbol={symbol}
      disabled={disabled}
      price={price}
      bigFigure={bigFigure}
      pip={pip}
      tenth={tenth}
      isExpired={isExpired}
      persist={false}
    />
  )
}

export const PriceButtonInnerComponent: React.FC<{
  direction: Direction
  rfqQuoteState: QuoteState
  symbol: any
  disabled: boolean
  price: any
  bigFigure: any
  pip: any
  tenth: any
  isExpired: any
  persist: boolean
}> = ({
  direction,
  rfqQuoteState,
  symbol,
  disabled,
  price,
  bigFigure,
  pip,
  tenth,
  isExpired,
  persist,
}) => {
  return (
    <TradeButton
      direction={direction}
      onClick={() => {
        sendExecution(symbol, direction)
      }}
      priceAnnounced={rfqQuoteState.stage === QuoteStateStage.Received}
      disabled={disabled}
    >
      <Price disabled={disabled}>
        <CenteringContainer>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big>{price ? bigFigure : "-"}</Big>
        </CenteringContainer>
        {price && (
          <>
            <Pip>{pip}</Pip>
            <Tenth>{tenth}</Tenth>
          </>
        )}
      </Price>
      {isExpired && !persist && (
        <ExpiredPrice data-testid="expireLabel">Expired</ExpiredPrice>
      )}
      {isExpired && persist && (
        <ExpiredPersist data-testid="expireLabel">Expired</ExpiredPersist>
      )}
    </TradeButton>
  )
}

export const PriceButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const rfqState = useRfqState()

  return rfqState.stage === QuoteStateStage.Requested ? (
    <QuotePriceLoading>
      <AdaptiveLoader size={16} />
      Awaiting Price
    </QuotePriceLoading>
  ) : (
    <PriceButtonInner direction={direction} rfqQuoteState={rfqState} />
  )
}
