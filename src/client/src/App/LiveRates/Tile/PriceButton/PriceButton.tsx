import { getPrice$ } from "@/services/prices"
import { Direction } from "@/services/trades"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
  DECIMAL_SEPARATOR,
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
  PriceButtonDisabledPlaceholder,
  Icon,
} from "./PriceButton.styles"
import { of } from "rxjs"
import { useIsNotionalValid } from "../Notional/Notional"
import { getRfqPayload$, QuoteState, useIsRfq } from "../Rfq/Rfq.state"
import { CurrencyPair } from "@/services/currencyPairs"

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

const formatSimple = customNumberFormatter()
const formatTo2Digits = significantDigitsNumberFormatter(2)
const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

export type PriceButtonProps = {
  direction: Direction
  price: number
  currencyPair: CurrencyPair
  priceAnnounced: boolean
  disabled: boolean
  isExpired: boolean
  isStatic?: boolean
  onClick: () => void
}

export const PriceButtonInner: React.FC<PriceButtonProps> = ({
  direction,
  price,
  currencyPair,
  priceAnnounced,
  disabled,
  isExpired,
  isStatic,
  onClick,
}) => {
  const { pipsPosition, ratePrecision, symbol } = currencyPair
  const rateString = price.toFixed(ratePrecision)
  const [wholeNumber, fractions_] = rateString.split(".")
  const fractions = fractions_ || "00000"

  const pip = formatToMin2IntDigits(
    Number(fractions.substring(pipsPosition - 2, pipsPosition)),
  )
  const tenth = formatSimple(
    Number(fractions.substring(pipsPosition, pipsPosition + 1)),
  )

  const bigFigureNumber = Number(
    wholeNumber + "." + fractions.substring(0, pipsPosition - 2),
  )
  let bigFigure =
    bigFigureNumber < 1 && pipsPosition === 4
      ? formatTo2Digits(bigFigureNumber)
      : formatTo3Digits(bigFigureNumber)
  if (bigFigureNumber === Math.floor(bigFigureNumber))
    bigFigure += DECIMAL_SEPARATOR

  return (
    <TradeButton
      direction={direction}
      onClick={onClick}
      priceAnnounced={priceAnnounced}
      disabled={disabled}
      isStatic={isStatic}
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
      {isExpired && (
        <ExpiredPrice data-testid="expireLabel">Expired</ExpiredPrice>
      )}
    </TradeButton>
  )
}

const PriceButtonContainer: React.FC<{
  direction: Direction
  rfqQuoteState: QuoteState
}> = ({ direction, rfqQuoteState }) => {
  const currencyPair = useTileCurrencyPair()
  const { price, isExpired } = usePrice(currencyPair.symbol, direction)
  const isRfq = useIsRfq()
  const isNotionalValid = useIsNotionalValid()
  const disabled =
    price === 0 ||
    !isNotionalValid ||
    (isRfq && rfqQuoteState.stage !== QuoteStateStage.Received)

  return (
    <PriceButtonInner
      direction={direction}
      price={price}
      currencyPair={currencyPair}
      onClick={() => {
        sendExecution(currencyPair.symbol, direction)
      }}
      priceAnnounced={rfqQuoteState.stage === QuoteStateStage.Received}
      disabled={disabled}
      isExpired={isExpired}
    />
  )
}

export const AwaitingPriceButton = () => (
  <QuotePriceLoading>
    <AdaptiveLoader size={16} />
    Awaiting Price
  </QuotePriceLoading>
)

export const PriceButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const rfqState = useRfqState()

  return rfqState.stage === QuoteStateStage.Requested ? (
    <AwaitingPriceButton />
  ) : (
    <PriceButtonContainer direction={direction} rfqQuoteState={rfqState} />
  )
}

export const PriceUnavailableButton = () => (
  <PriceButtonDisabledPlaceholder>
    <Icon className="fas fa-ban fa-flip-horizontal" />
    Pricing Unavailable
  </PriceButtonDisabledPlaceholder>
)
