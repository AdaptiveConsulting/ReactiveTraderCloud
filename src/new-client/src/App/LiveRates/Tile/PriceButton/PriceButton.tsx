import React from "react"
import {getPrice$} from "services/prices"
import {Direction} from "services/trades"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
} from "utils/formatNumber"
import {sendExecution} from "../Tile.state"
import {
  TradeButton,
  Price,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
  PriceLoading,
} from "./PriceButton.styles"
import {useTileCurrencyPair} from "../Tile.context"
import {map} from "rxjs/operators"
import {bind} from "@react-rxjs/core"
import {CenteringContainer} from "components/CenteringContainer"
import {AdaptiveLoader} from "components/AdaptiveLoader"
import {useRfqState} from "../Rfq"
import {QuoteState} from "services/rfqs"

const [
  usePrice,
  getPriceDirection$,
] = bind((symbol: string, direction: Direction) =>
  getPrice$(symbol).pipe(
    map(({bid, ask}) => (direction === Direction.Buy ? ask : bid)),
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
}> = ({direction, price, ratePrecision, symbol, pipsPosition}) => {
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
        sendExecution({symbol, direction})
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
    </TradeButton>
  )
}

export const PriceButton: React.FC<{
  direction: Direction
}> = ({direction}) => {
  const {pipsPosition, ratePrecision, symbol} = useTileCurrencyPair()
  const streamingPrice = usePrice(symbol, direction)
  const rfqState = useRfqState()

  if (rfqState.quoteState === QuoteState.Init) {
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

  if (rfqState.quoteState === QuoteState.Requested) {
    return (
      <PriceLoading>
        <AdaptiveLoader size={16} />
        Awaiting Price
      </PriceLoading>
    )
  }

  return (
    <PriceButtonInner
      direction={direction}
      symbol={symbol}
      ratePrecision={ratePrecision}
      pipsPosition={pipsPosition}
      price={
        rfqState.rfqResponse!.price[direction === Direction.Buy ? "ask" : "bid"]
      }
    />
  )
}
