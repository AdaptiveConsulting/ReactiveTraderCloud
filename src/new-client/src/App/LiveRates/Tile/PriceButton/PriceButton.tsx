import React from "react"
import { getPrice$ } from "services/prices"
import { Direction } from "services/trades"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
} from "utils/formatNumber"
import { map, switchMap } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { CenteringContainer } from "components/CenteringContainer"
import { AdaptiveLoader } from "components/AdaptiveLoader"
import { sendExecution } from "../Tile.state"
import { useTileCurrencyPair } from "../Tile.context"
import { useRfqState, QuoteState } from "../Rfq"
import {
  TradeButton,
  Price,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
  QuotePriceLoading,
  ExpiredPrice,
} from "./PriceButton.styles"
import { of } from "rxjs"
import { getRfqPayload$ } from "../Rfq/Rfq.state"

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
}> = ({ direction }) => {
  const { pipsPosition, ratePrecision, symbol } = useTileCurrencyPair()
  const { price, isExpired } = usePrice(symbol, direction)
  const disabled = price === 0

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
    <TradeButton
      direction={direction}
      onClick={() => {
        sendExecution({ symbol, direction })
      }}
      priceAnnounced={false}
      disabled={disabled}
    >
      <Price disabled={disabled}>
        <CenteringContainer>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big>{disabled ? "-" : bigFigure}</Big>
        </CenteringContainer>
        {!disabled && (
          <>
            <Pip>{pip}</Pip>
            <Tenth>{tenth}</Tenth>
          </>
        )}
      </Price>
      {isExpired && <ExpiredPrice>Expired</ExpiredPrice>}
    </TradeButton>
  )
}

export const PriceButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const rfqState = useRfqState()

  return rfqState.state === QuoteState.Requested ? (
    <QuotePriceLoading>
      <AdaptiveLoader size={16} />
      Awaiting Price
    </QuotePriceLoading>
  ) : (
    <PriceButtonInner direction={direction} />
  )
}
