import React from "react"
import { getPrice$ } from "services/prices"
import { Direction } from "services/trades"
import type { RfqResponse } from "services/rfqs"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
} from "utils/formatNumber"
import { map } from "rxjs/operators"
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

const [
  usePrice,
  getPriceDirection$,
] = bind((symbol: string, direction: Direction) =>
  getPrice$(symbol).pipe(
    map(({ bid, ask }) => (direction === Direction.Buy ? ask : bid)),
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
  price: number
  ratePrecision: number
  symbol: string
  pipsPosition: number
  isExpired?: boolean
}> = ({ direction, price, ratePrecision, symbol, pipsPosition, isExpired }) => {
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

const PriceFromStreamButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const { pipsPosition, ratePrecision, symbol } = useTileCurrencyPair()
  const streamingPrice = usePrice(symbol, direction)
  return (
    <PriceButtonInner
      direction={direction}
      symbol={symbol}
      ratePrecision={ratePrecision}
      pipsPosition={pipsPosition}
      price={streamingPrice}
    />
  )
}

const PriceFromQuote: React.FC<{
  direction: Direction
  rfqResponse: RfqResponse
  isExpired: boolean
}> = ({ direction, rfqResponse, isExpired }) => {
  const {
    currencyPair: { symbol, ratePrecision, pipsPosition },
    price,
  } = rfqResponse
  return (
    <PriceButtonInner
      direction={direction}
      symbol={symbol}
      ratePrecision={ratePrecision}
      pipsPosition={pipsPosition}
      isExpired={isExpired}
      price={price[direction === Direction.Buy ? "ask" : "bid"]}
    />
  )
}

export const PriceButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const rfqState = useRfqState()

  if (rfqState.quoteState === QuoteState.Init) {
    return <PriceFromStreamButton direction={direction} />
  }

  if (rfqState.quoteState === QuoteState.Requested) {
    return (
      <QuotePriceLoading>
        <AdaptiveLoader size={16} />
        Awaiting Price
      </QuotePriceLoading>
    )
  }

  if (rfqState.rfqResponse) {
    return (
      <PriceFromQuote
        direction={direction}
        isExpired={rfqState.quoteState === QuoteState.Rejected}
        rfqResponse={rfqState.rfqResponse}
      />
    )
  }

  throw new Error()
}
