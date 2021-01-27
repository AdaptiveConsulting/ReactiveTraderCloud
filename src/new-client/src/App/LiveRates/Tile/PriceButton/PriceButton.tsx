import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { getPrice$ } from "services/prices"
import { Direction } from "services/trades"
import {
  customNumberFormatter,
  significantDigitsNumberFormatter,
} from "utils/formatNumber"
import { useTileCurrencyPair } from "../Tile.context"
import { sendExecution } from "../Tile.state"
import {
  TradeButton,
  Price,
  BigWrapper,
  DirectionLabel,
  Big,
  Pip,
  Tenth,
} from "./PriceButton.styles"

const formatTo3Digits = significantDigitsNumberFormatter(3)
const formatToMin2IntDigits = customNumberFormatter({
  minimumIntegerDigits: 2,
})

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

export const PriceButton: React.FC<{
  direction: Direction
}> = ({ direction }) => {
  const { pipsPosition, ratePrecision, symbol } = useTileCurrencyPair()
  const price = usePrice(symbol, direction)

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
        <BigWrapper>
          <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
          <Big>{disabled ? "-" : bigFigure}</Big>
        </BigWrapper>
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
